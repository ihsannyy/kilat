package main

import (
	"fmt"
	"github.com/fatih/color"
	"kilat/internal/engine"
	"kilat/internal/initcmd"
	"kilat/internal/pkgmanager"
	"kilat/internal/repl"
	"kilat/internal/scripts"
	"kilat/internal/utils"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

func main() {
	utils.CheckUpdate()
	utils.LoadEnv()

	if len(os.Args) == 2 && (os.Args[1] == "--version" || os.Args[1] == "-v") {
		fmt.Printf("Kilat v%s\n", utils.Version)
		return
	}

	if len(os.Args) == 2 && os.Args[1] == "--update" {
		utils.SelfUpdate()
		return
	}

	if len(os.Args) < 2 {
		printHelp()
		return
	}

	switch os.Args[1] {
	case "run":
		if len(os.Args) < 3 {
			color.Red("❌ Gunakan: kilat run <file.js> [--watch]")
			return
		}

		watchMode := false
		var filePath string
		for _, arg := range os.Args[2:] {
			if arg == "--watch" || arg == "-w" {
				watchMode = true
			} else {
				filePath = arg
			}
		}

		if filePath == "" {
			color.Red("❌ Gunakan: kilat run <file.js> [--watch]")
			return
		}

		if watchMode {
			runAndWatch(filePath)
		} else {
			executed, err := scripts.RunScript(filePath)
			if err != nil {
				color.Red("❌ Script failed: %v", err)
				os.Exit(1)
			}
			if !executed {
				executeFile(filePath)
			}
		}

	case "add":
		if len(os.Args) < 3 {
			color.Red("❌ Gunakan: kilat add <package>")
			return
		}
		pkg := os.Args[2]
		if err := pkgmanager.Add(pkg); err != nil {
			color.Red("❌ Gagal install: %v", err)
			os.Exit(1)
		}
	case "remove", "rm":
		if len(os.Args) < 3 {
			color.Red("❌ Gunakan: kilat remove <package>")
			return
		}
		pkg := os.Args[2]
		if err := pkgmanager.Remove(pkg); err != nil {
			color.Red("❌ Gagal hapus: %v", err)
			os.Exit(1)
		}
	case "build":
		if len(os.Args) < 4 {
			color.Red("❌ Gunakan: kilat build <input.ts/js> <output.js>")
			return
		}
		input := os.Args[2]
		output := os.Args[3]
		color.Cyan("📦 Memulai bundling berkas...")
		if err := engine.BuildFile(input, output); err != nil {
			color.Red("❌ Gagal build: %v", err)
			os.Exit(1)
		}
		color.Magenta("✨ Berkas berhasil di-build ke %s", output)
	case "repl":
		repl.Start()
	case "info":
		printInfo()
	case "init":
		autoYes := false
		if len(os.Args) >= 3 && (os.Args[2] == "-y" || os.Args[2] == "--yes") {
			autoYes = true
		}
		if err := initcmd.RunInit(autoYes); err != nil {
			color.Red("❌ Gagal init: %v", err)
			os.Exit(1)
		}
	case "start":
		executed, err := scripts.RunScript("start")
		if err != nil {
			color.Red("❌ Script failed: %v", err)
			os.Exit(1)
		}
		if !executed {
			files := []string{"index.ts", "index.js", "server.ts", "server.js"}
			found := false
			for _, f := range files {
				if _, err := os.Stat(f); err == nil {
					executeFile(f)
					found = true
					break
				}
			}
			if !found {
				color.Red("❌ Gagal: Tidak ada script 'start' di package.json dan tidak menemukan file index.js/server.js")
				os.Exit(1)
			}
		}
	default:
		printHelp()
	}
}

func executeFile(filePath string) {
	runtime := engine.New(engine.DefaultOptions())
	if err := runtime.RunFile(filePath); err != nil {
		color.Red("❌ Error: %v", err)
	}
}

func runAndWatch(filePath string) {
	cyan := color.New(color.FgCyan, color.Bold)
	cyan.Println("👀 Watch mode aktif. Menunggu perubahan file (.js / .ts / .jsx / .tsx / .json)...")
	executeFile(filePath)

	lastModTime := getMaxModTime()
	for {
		time.Sleep(500 * time.Millisecond)
		currentModTime := getMaxModTime()
		if currentModTime.After(lastModTime) {
			lastModTime = currentModTime
			cyan.Println("\n🔄 Perubahan terdeteksi. Memulai ulang...")
			executeFile(filePath)
		}
	}
}

func getMaxModTime() time.Time {
	var maxTime time.Time
	_ = filepath.Walk(".", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			name := info.Name()
			if name == ".git" || name == ".kilat" || name == "node_modules" || name == "website" {
				return filepath.SkipDir
			}
			return nil
		}
		ext := filepath.Ext(path)
		if ext == ".js" || ext == ".cjs" || ext == ".mjs" || ext == ".ts" || ext == ".jsx" || ext == ".tsx" || ext == ".json" {
			if info.ModTime().After(maxTime) {
				maxTime = info.ModTime()
			}
		}
		return nil
	})
	return maxTime
}

func printInfo() {
	cyan := color.New(color.FgCyan, color.Bold)
	green := color.New(color.FgGreen)

	cyan.Println("🚀 Kilat Runtime Info")
	fmt.Println()

	fmt.Print("  Version    ")
	green.Println(utils.Version)

	fmt.Print("  Go         ")
	green.Println("1.25.0")

	fmt.Print("  Platform   ")
	green.Println(runtime.GOOS)

	fmt.Print("  Arch       ")
	green.Println(runtime.GOARCH)

	fmt.Println()
	cyan.Println("  Built-in Modules:")

	modules := []string{
		"fs", "os", "path", "crypto", "child_process",
		"buffer", "stream", "timers", "websocket",
	}
	for _, m := range modules {
		fmt.Printf("    %s\n", m)
	}
}

func printHelp() {
	cyan := color.New(color.FgCyan, color.Bold)
	cyan.Printf("🚀 Kilat v%s\n", utils.Version)
	fmt.Println()
	color.New(color.FgWhite).Println("Commands:")
	fmt.Println("  init      Inisialisasi proyek")
	fmt.Println("  run       Jalankan file JS/TS")
	fmt.Println("  start     Jalankan script start")
	fmt.Println("  add       Install package npm")
	fmt.Println("  remove    Hapus package")
	fmt.Println("  build     Bundle & minify")
	fmt.Println("  repl      REPL interaktif")
	fmt.Println("  info      Tampilkan info runtime")
	fmt.Println()
	color.New(color.FgWhite).Println("Flags:")
	fmt.Println("  --version    Versi Kilat")
	fmt.Println("  --update     Update ke versi terbaru")
	fmt.Println("  --watch      Auto-restart (run)")
	fmt.Println("  -y           Auto-yes (init)")
}
