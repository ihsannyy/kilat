package repl

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"kilat/internal/engine"
	"kilat/internal/utils"

	"github.com/dop251/goja"
	"github.com/fatih/color"
)

func Start() {
	cyan := color.New(color.FgCyan, color.Bold)
	yellow := color.New(color.FgYellow)
	green := color.New(color.FgGreen)
	red := color.New(color.FgRed)
	gray := color.New(color.FgWhite).Add(color.Faint)

	cyan.Printf("⚡ Kilat REPL v%s (Interactive JavaScript Shell)\n", utils.Version)
	gray.Println("Ketik '.exit' atau tekan Ctrl+C / Ctrl+D untuk keluar.")
	fmt.Println()

	rt := engine.New(engine.DefaultOptions())
	rt.SetGlobalRequire(".")

	rt.SetHasServer(true)

	yellow.Print("kilat> ")

	go func() {
		scanner := bufio.NewScanner(os.Stdin)
		for scanner.Scan() {
			line := scanner.Text()
			rt.QueueJob(func() {
				trimmed := strings.TrimSpace(line)
				if trimmed == ".exit" || trimmed == "exit" || trimmed == "exit()" {
					fmt.Println("\nSampai jumpa! ⚡")
					os.Exit(0)
				}
				if trimmed != "" {
					val, err := rt.VM().RunString(trimmed)
					if err != nil {
						red.Printf("❌ Error: %v\n", err)
					} else if val != nil && !goja.IsUndefined(val) {
						printValue(val, green)
					}
				}
				yellow.Print("kilat> ")
			})
		}
		rt.QueueJob(func() {
			fmt.Println("\nSampai jumpa! ⚡")
			os.Exit(0)
		})
	}()

	rt.RunEventLoop()
}

func printValue(val goja.Value, green *color.Color) {
	if goja.IsNull(val) {
		color.New(color.FgWhite, color.Bold).Println("null")
		return
	}

	// Check type
	switch val.ExportType().Kind() {
	case 0: // Goja Undefined/Null/etc can be checked or generic fallback
		if val.String() == "undefined" {
			return
		}
	}

	// Format output nicely based on value type
	strVal := val.String()
	if val.ExportType() != nil && val.ExportType().String() == "string" {
		green.Printf("'%s'\n", strVal)
	} else if strings.HasPrefix(strVal, "function") {
		color.New(color.FgCyan).Println("[Function]")
	} else if strings.HasPrefix(strVal, "[object Object]") {
		// Try to format object as JSON if possible
		exportVal := val.Export()
		if exportVal != nil {
			// Print formatted object representation
			fmt.Printf("%+v\n", exportVal)
		} else {
			fmt.Println(strVal)
		}
	} else {
		green.Println(strVal)
	}
}
