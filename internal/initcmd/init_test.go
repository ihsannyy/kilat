package initcmd

import (
	"os"
	"path/filepath"
	"testing"
)

func TestRunInit(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_init_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	origWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(origWd)

	err = os.Chdir(tmpDir)
	if err != nil {
		t.Fatal(err)
	}

	err = RunInit(true)
	if err != nil {
		t.Fatalf("RunInit failed: %v", err)
	}

	pkgFile := filepath.Join(tmpDir, "package.json")
	if _, err := os.Stat(pkgFile); os.IsNotExist(err) {
		t.Fatalf("package.json was not created")
	}

	mainFile := filepath.Join(tmpDir, "index.js")
	if _, err := os.Stat(mainFile); os.IsNotExist(err) {
		t.Fatalf("index.js was not created")
	}
}
