package modules

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/dop251/goja"
)

func TestFSModule(t *testing.T) {
	vm := goja.New()
	RegisterFS(vm)

	tmpDir, err := os.MkdirTemp("", "kilat_fs_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	file1 := filepath.Join(tmpDir, "hello.txt")
	vm.Set("tmpFile", file1)

	code := `
		fs.writeFileSync(tmpFile, "World");
		if (!fs.existsSync(tmpFile)) throw new Error("file should exist");
		const content = fs.readFileSync(tmpFile);
		if (content !== "World") throw new Error("content mismatch: " + content);
		const list = fs.readdirSync(tmpDir);
	`
	vm.Set("tmpDir", tmpDir)
	_, err = vm.RunString(code)
	if err != nil {
		t.Fatalf("FS module test failed: %v", err)
	}
}

func TestCryptoModule(t *testing.T) {
	vm := goja.New()
	RegisterCrypto(vm)

	code := `
		const h1 = crypto.createHash('sha256').update('hello').digest('hex');
		if (typeof h1 !== 'string' || h1.length !== 64) throw new Error("sha256 digest failed");

		const h2 = crypto.createHash('md5').update('hello').digest('hex');
		if (typeof h2 !== 'string' || h2.length !== 32) throw new Error("md5 digest failed");

		const h3 = crypto.createHash('sha1').update('hello').digest('hex');
		if (typeof h3 !== 'string' || h3.length !== 40) throw new Error("sha1 digest failed");

		const h4 = crypto.createHash('sha512').update('hello').digest('hex');
		if (typeof h4 !== 'string' || h4.length !== 128) throw new Error("sha512 digest failed");

		const mac = crypto.createHmac('sha256', 'secret').update('data').digest('hex');
		if (typeof mac !== 'string') throw new Error("hmac failed");

		const rand = crypto.randomBytes(16);
		if (!rand) throw new Error("randomBytes failed");
	`
	_, err := vm.RunString(code)
	if err != nil {
		t.Fatalf("Crypto module test failed: %v", err)
	}
}

func TestOSModule(t *testing.T) {
	vm := goja.New()
	RegisterOS(vm, func(f func()) { f() }, func() {}, func() {})

	code := `
		if (typeof os.platform() !== 'string') throw new Error("os.platform failed");
		if (typeof os.arch() !== 'string') throw new Error("os.arch failed");
		if (typeof os.homedir() !== 'string') throw new Error("os.homedir failed");
		if (typeof os.cwd() !== 'string') throw new Error("os.cwd failed");
	`
	_, err := vm.RunString(code)
	if err != nil {
		t.Fatalf("OS module test failed: %v", err)
	}
}

func TestConsoleModule(t *testing.T) {
	vm := goja.New()
	RegisterConsole(vm)

	code := `
		console.log("Hello", { a: 1 }, [1, 2]);
		console.warn("Warning test");
		console.error("Error test");
	`
	_, err := vm.RunString(code)
	if err != nil {
		t.Fatalf("Console module test failed: %v", err)
	}
}
