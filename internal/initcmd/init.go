package initcmd

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"github.com/fatih/color"
)

type PackageJSON struct {
	Name            string            `json:"name"`
	Version         string            `json:"version"`
	Description     string            `json:"description"`
	Main            string            `json:"main"`
	Author          string            `json:"author"`
	License         string            `json:"license"`
	Dependencies    map[string]string `json:"dependencies"`
	DevDependencies map[string]string `json:"devDependencies"`
}

func RunInit(autoYes bool) error {
	if _, err := os.Stat("package.json"); err == nil {
		if !autoYes {
			color.Yellow("⚠️  package.json sudah ada. Overwrite? (y/n)")
			reader := bufio.NewReader(os.Stdin)
			answer, _ := reader.ReadString('\n')
			answer = strings.TrimSpace(strings.ToLower(answer))
			if answer != "y" && answer != "yes" {
				color.Cyan("⏹️  Inisialisasi dibatalkan.")
				return nil
			}
		}
	}

	var name, version, desc, main, author, license string
	dir, _ := os.Getwd()
	defaultName := filepath.Base(dir)

	if autoYes {
		name = defaultName
		version = "1.0.0"
		desc = ""
		main = "index.js"
		author = ""
		license = "MIT"
	} else {
		reader := bufio.NewReader(os.Stdin)
		color.Cyan("📦 Inisialisasi proyek Kilat")
		fmt.Println()

		fmt.Print("Nama proyek (default: " + defaultName + "): ")
		name, _ = reader.ReadString('\n')
		name = strings.TrimSpace(name)
		if name == "" {
			name = defaultName
		}

		fmt.Print("Versi (default: 1.0.0): ")
		version, _ = reader.ReadString('\n')
		version = strings.TrimSpace(version)
		if version == "" {
			version = "1.0.0"
		}

		fmt.Print("Deskripsi: ")
		desc, _ = reader.ReadString('\n')
		desc = strings.TrimSpace(desc)

		fmt.Print("Entry point (default: index.js): ")
		main, _ = reader.ReadString('\n')
		main = strings.TrimSpace(main)
		if main == "" {
			main = "index.js"
		}

		fmt.Print("Author: ")
		author, _ = reader.ReadString('\n')
		author = strings.TrimSpace(author)

		fmt.Print("License (default: MIT): ")
		license, _ = reader.ReadString('\n')
		license = strings.TrimSpace(license)
		if license == "" {
			license = "MIT"
		}
	}

	pkg := PackageJSON{
		Name:            name,
		Version:         version,
		Description:     desc,
		Main:            main,
		Author:          author,
		License:         license,
		Dependencies:    make(map[string]string),
		DevDependencies: make(map[string]string),
	}

	data, err := json.MarshalIndent(pkg, "", "  ")
	if err != nil {
		return err
	}
	if err := os.WriteFile("package.json", data, 0644); err != nil {
		return err
	}

	if _, err := os.Stat(main); os.IsNotExist(err) {
		exampleJS := `// 🚀 Kilat Project: ` + name + `
console.log("Hello from Kilat!");

const fs = require('fs');
const os = require('os');

console.log("OS:", os.getenv("OSTYPE") || "unknown");
console.log("Files:", fs.readdirSync("."));
`
		os.WriteFile(main, []byte(exampleJS), 0644)
		color.Green("✅ File %s dibuat", main)
	}

	color.Green("\n✅ Proyek Kilat berhasil diinisialisasi!")
	color.Cyan("   📄 package.json")
	color.Cyan("   📄 " + main)
	color.White("\nSelanjutnya, jalankan:")
	color.Yellow("   kilat run " + main)

	return nil
}