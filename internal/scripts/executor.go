package scripts

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"os/exec"
	"runtime"

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

	var shell, flag string
	if customShell := os.Getenv("SHELL"); customShell != "" {
		shell = customShell
		flag = "-c"
	} else if runtime.GOOS == "windows" {
		shell = "cmd.exe"
		flag = "/c"
	} else {
		shell = "sh"
		flag = "-c"
	}

	cmd := exec.Command(shell, flag, cmdStr)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	if err := cmd.Run(); err != nil {
		return true, err
	}
	return true, nil
}
