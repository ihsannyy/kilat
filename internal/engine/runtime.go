package engine

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"sync/atomic"
	"github.com/dop251/goja"
	"github.com/evanw/esbuild/pkg/api"
	"kilat/internal/modules"
)

type Runtime struct {
	vm          *goja.Runtime
	cache       map[string]*moduleRecord
	jobs        chan func()
	hasServer   bool
	activeTasks int32
}

type moduleRecord struct {
	exports goja.Value
}

func New(opts Options) *Runtime {
	vm := goja.New()
	
	r := &Runtime{
		vm:    vm,
		cache: make(map[string]*moduleRecord),
		jobs:  make(chan func(), 1024),
	}

	modules.RegisterConsole(vm)
	modules.RegisterFS(vm)
	modules.RegisterNet(vm, func(job func()) {
		r.jobs <- job
	}, func() {
		atomic.AddInt32(&r.activeTasks, 1)
	}, func() {
		atomic.AddInt32(&r.activeTasks, -1)
	})
	modules.RegisterOS(vm, func(job func()) {
		r.jobs <- job
	}, func() {
		atomic.AddInt32(&r.activeTasks, 1)
	}, func() {
		atomic.AddInt32(&r.activeTasks, -1)
	})
	modules.RegisterBun(vm, func(job func()) {
		r.jobs <- job
	}, func(hasServer bool) {
		r.hasServer = hasServer
	})

	bootstrapJS := `
		class Headers {
			constructor(init) {
				this._headers = {};
				if (init) {
					if (init instanceof Headers) {
						this._headers = { ...init._headers };
					} else if (typeof init === 'object') {
						for (const [key, val] of Object.entries(init)) {
							this._headers[key.toLowerCase()] = String(val);
						}
					}
				}
			}
			get(name) {
				return this._headers[name.toLowerCase()] || null;
			}
			set(name, value) {
				this._headers[name.toLowerCase()] = String(value);
			}
			forEach(callback) {
				for (const [key, val] of Object.entries(this._headers)) {
					callback(val, key);
				}
			}
		}

		class Request {
			constructor(url, options = {}) {
				this.url = url;
				this.method = options.method || 'GET';
				this.headers = new Headers(options.headers);
				this._body = options.body || '';
			}
			async text() {
				return this._body;
			}
			async json() {
				return JSON.parse(this._body);
			}
		}

		class Response {
			constructor(body, options = {}) {
				this._body = body === null || body === undefined ? '' : String(body);
				this.status = options.status || 200;
				this.headers = new Headers(options.headers);
			}
			async text() {
				return this._body;
			}
			async json() {
				return JSON.parse(this._body);
			}
		}

		globalThis.Headers = Headers;
		globalThis.Request = Request;
		globalThis.Response = Response;

		globalThis.__handleRequest = function(fetchFn, request, callback) {
			try {
				const result = fetchFn(request);
				if (result && typeof result.then === 'function') {
					result.then(
						res => {
							let finalRes = res;
							if (!(res instanceof Response)) {
								finalRes = new Response(res);
							}
							callback(null, finalRes);
						},
						err => callback(err, null)
					);
				} else {
					let finalRes = result;
					if (!(result instanceof Response)) {
						finalRes = new Response(result);
					}
					callback(null, finalRes);
				}
			} catch (err) {
				callback(err, null);
			}
		};

		globalThis.fetch = function(url, options = {}) {
			return new Promise((resolve, reject) => {
				const method = options.method || 'GET';
				const headers = {};
				if (options.headers) {
					new Headers(options.headers).forEach((value, key) => {
						headers[key] = value;
					});
				}
				const body = options.body || '';

				globalThis.__nativeFetch(url, method, headers, body, (err, resp) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve(new Response(resp.body, {
							status: resp.status,
							headers: resp.headers
						}));
					}
				});
			});
		};

		globalThis.$ = function(strings, ...values) {
			let cmd = '';
			if (Array.isArray(strings)) {
				for (let i = 0; i < strings.length; i++) {
					cmd += strings[i];
					if (i < values.length) {
						cmd += values[i];
					}
				}
			} else {
				cmd = strings;
			}

			return new Promise((resolve, reject) => {
				globalThis.__nativeExec(cmd, (err, stdout, stderr, exitCode) => {
					if (err) {
						reject(new Error(err));
					} else {
						resolve({
							text() { return stdout; },
							json() { return JSON.parse(stdout); },
							stderr: stderr,
							exitCode: exitCode
						});
					}
				});
			});
		};
	`
	_, err := vm.RunString(bootstrapJS)
	if err != nil {
		panic(fmt.Sprintf("failed to run bootstrap JS: %v", err))
	}

	return r
}

func (r *Runtime) RunFile(path string) error {
	absPath, err := filepath.Abs(path)
	if err != nil {
		return err
	}
	_, err = r.loadModule(absPath)
	if err != nil {
		return err
	}
	r.RunEventLoop()
	return nil
}

func (r *Runtime) loadModule(absolutePath string) (goja.Value, error) {
	if record, ok := r.cache[absolutePath]; ok {
		return record.exports, nil
	}

	// Create placeholder in cache to handle circular require()
	moduleObj := r.vm.NewObject()
	exportsObj := r.vm.NewObject()
	moduleObj.Set("exports", exportsObj)
	record := &moduleRecord{exports: exportsObj}
	r.cache[absolutePath] = record

	// Parse JSON files directly without wrapping
	if filepath.Ext(absolutePath) == ".json" {
		jsonData, err := ioutil.ReadFile(absolutePath)
		if err != nil {
			return nil, err
		}
		jsonVal, err := r.vm.RunString(fmt.Sprintf("JSON.parse(%q)", string(jsonData)))
		if err != nil {
			return nil, err
		}
		record.exports = jsonVal
		return jsonVal, nil
	}

	codeBytes, err := ioutil.ReadFile(absolutePath)
	if err != nil {
		return nil, err
	}

	ext := filepath.Ext(absolutePath)
	var loader api.Loader
	switch ext {
	case ".ts":
		loader = api.LoaderTS
	case ".tsx":
		loader = api.LoaderTSX
	case ".jsx":
		loader = api.LoaderJSX
	default:
		loader = api.LoaderJS
	}

	res := api.Transform(string(codeBytes), api.TransformOptions{
		Loader: loader,
		Format: api.FormatCommonJS,
		Target: api.ES2015,
	})

	if len(res.Errors) > 0 {
		var errMsg strings.Builder
		for _, msg := range res.Errors {
			errMsg.WriteString(fmt.Sprintf("%s:%d:%d: error: %s\n", msg.Location.File, msg.Location.Line, msg.Location.Column, msg.Text))
		}
		return nil, fmt.Errorf("compile error: %s", errMsg.String())
	}

	codeString := string(res.Code)

	currentDir := filepath.Dir(absolutePath)
	requireFunc := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(r.vm.ToValue("require() expects 1 argument"))
		}
		moduleName := call.Arguments[0].String()
		
		if moduleName == "os" || moduleName == "fs" || moduleName == "net" || moduleName == "console" || moduleName == "bun" {
			return r.vm.Get(moduleName)
		}
		
		resolved, err := resolvePath(currentDir, moduleName)
		if err != nil {
			panic(r.vm.NewGoError(err))
		}
		val, err := r.loadModule(resolved)
		if err != nil {
			panic(r.vm.NewGoError(err))
		}
		return val
	}

	wrappedCode := "(function(exports, require, module, __filename, __dirname) {\n" + codeString + "\n})"
	
	prg, err := goja.Compile(absolutePath, wrappedCode, false)
	if err != nil {
		return nil, err
	}

	wrapperVal, err := r.vm.RunProgram(prg)
	if err != nil {
		return nil, err
	}

	wrapperFn, ok := goja.AssertFunction(wrapperVal)
	if !ok {
		return nil, fmt.Errorf("failed to compile module function")
	}

	// Call the wrapped CommonJS function
	_, err = wrapperFn(goja.Undefined(), 
		exportsObj, 
		r.vm.ToValue(requireFunc), 
		moduleObj, 
		r.vm.ToValue(absolutePath), 
		r.vm.ToValue(currentDir),
	)
	if err != nil {
		return nil, err
	}

	// Fetch final module.exports value (in case the module overwrote module.exports)
	finalExports := moduleObj.Get("exports")
	record.exports = finalExports

	return finalExports, nil
}

func resolvePath(currentDir, moduleName string) (string, error) {
	var targetPath string
	if filepath.IsAbs(moduleName) {
		targetPath = moduleName
	} else if (len(moduleName) >= 2 && moduleName[:2] == "./") || (len(moduleName) >= 3 && moduleName[:3] == "../") {
		targetPath = filepath.Join(currentDir, moduleName)
	} else {
		baseDir := ".kilat/packages"
		homeDir, _ := os.UserHomeDir()
		globalDir := filepath.Join(homeDir, ".kilat", "packages")

		possibleDirs := []string{baseDir, globalDir}
		for _, dir := range possibleDirs {
			moduleDir := filepath.Join(dir, moduleName)
			if info, err := os.Stat(moduleDir); err == nil && info.IsDir() {
				pkgJsonPath := filepath.Join(moduleDir, "package.json")
				if _, err := os.Stat(pkgJsonPath); err == nil {
					data, err := ioutil.ReadFile(pkgJsonPath)
					if err == nil {
						var pkgInfo struct {
							Main string `json:"main"`
						}
						if err := json.Unmarshal(data, &pkgInfo); err == nil && pkgInfo.Main != "" {
							mainPath := filepath.Join(moduleDir, pkgInfo.Main)
							pathsToTry := []string{
								mainPath,
								mainPath + ".js",
								filepath.Join(mainPath, "index.js"),
							}
							for _, p := range pathsToTry {
								if info, err := os.Stat(p); err == nil && !info.IsDir() {
									return filepath.Abs(p)
								}
							}
						}
					}
				}
				p1 := filepath.Join(moduleDir, "index.js")
				p2 := filepath.Join(moduleDir, moduleName+".js")
				if _, err := os.Stat(p1); err == nil {
					return filepath.Abs(p1)
				}
				if _, err := os.Stat(p2); err == nil {
					return filepath.Abs(p2)
				}
			}
		}
		return "", fmt.Errorf("module '%s' tidak ditemukan", moduleName)
	}

	possiblePaths := []string{
		targetPath,
		targetPath + ".js",
		targetPath + ".json",
		targetPath + ".ts",
		targetPath + ".tsx",
		targetPath + ".jsx",
		filepath.Join(targetPath, "index.js"),
		filepath.Join(targetPath, "index.ts"),
	}

	for _, p := range possiblePaths {
		if info, err := os.Stat(p); err == nil && !info.IsDir() {
			return filepath.Abs(p)
		}
	}

	return "", fmt.Errorf("file '%s' tidak ditemukan", moduleName)
}

func (r *Runtime) VM() *goja.Runtime {
	return r.vm
}

func (r *Runtime) SetGlobalRequire(currentDir string) {
	requireFunc := func(call goja.FunctionCall) goja.Value {
		if len(call.Arguments) < 1 {
			panic(r.vm.ToValue("require() expects 1 argument"))
		}
		moduleName := call.Arguments[0].String()
		
		if moduleName == "os" || moduleName == "fs" || moduleName == "net" || moduleName == "console" || moduleName == "bun" {
			return r.vm.Get(moduleName)
		}
		
		resolved, err := resolvePath(currentDir, moduleName)
		if err != nil {
			panic(r.vm.NewGoError(err))
		}
		val, err := r.loadModule(resolved)
		if err != nil {
			panic(r.vm.NewGoError(err))
		}
		return val
	}
	r.vm.Set("require", requireFunc)
}

func (r *Runtime) QueueJob(job func()) {
	r.jobs <- job
}

func (r *Runtime) SetHasServer(val bool) {
	r.hasServer = val
}

func (r *Runtime) RunEventLoop() {
	for {
		select {
		case job, ok := <-r.jobs:
			if !ok {
				return
			}
			job()
		default:
			if r.hasServer || atomic.LoadInt32(&r.activeTasks) > 0 {
				job, ok := <-r.jobs
				if !ok {
					return
				}
				job()
			} else {
				return
			}
		}
	}
}