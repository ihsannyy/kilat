package pkgmanager

import (
	"os"
	"path/filepath"
	"testing"
)

func TestAddAndRemovePackage(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_pkg_test_*")
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

	err = Add("is-number")
	if err != nil {
		t.Fatalf("Add package failed: %v", err)
	}

	installedDir := filepath.Join(".kilat", "packages", "is-number")
	if _, err := os.Stat(installedDir); os.IsNotExist(err) {
		t.Fatalf("package directory not created: %s", installedDir)
	}

	err = Remove("is-number")
	if err != nil {
		t.Fatalf("Remove package failed: %v", err)
	}

	if _, err := os.Stat(installedDir); !os.IsNotExist(err) {
		t.Fatalf("package directory still exists after removal")
	}
}
