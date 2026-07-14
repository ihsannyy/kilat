package scripts

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"os/exec"

	"github.com/fatih/color"
)

type PackageJSON struct {
	Scripts map[string]string `json:"scripts"`
}

func RunScript(scriptName string) (bool, error) {
	data, err := ioutil.ReadFile("package.json")
	if err != nil {
		return false, nil
	}

	var pkg PackageJSON
	if err := json.Unmarshal(data, &pkg); err != nil {
		return false, nil
	}

	cmdStr, exists := pkg.Scripts[scriptName]
	if !exists {
		return false, nil
	}

	color.Cyan("🏃 Running script %s: %s", scriptName, cmdStr)

	shell := "sh"
	if termuxShell := os.Getenv("SHELL"); termuxShell != "" {
		shell = termuxShell
	}

	cmd := exec.Command(shell, "-c", cmdStr)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	if err := cmd.Run(); err != nil {
		return true, err
	}
	return true, nil
}
