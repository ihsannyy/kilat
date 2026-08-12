package utils

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadEnv(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_env_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	origWd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}
	defer os.Chdir(origWd)

	_ = os.Chdir(tmpDir)
	_ = os.WriteFile(filepath.Join(tmpDir, ".env"), []byte("KILAT_TEST_VAR=\"super_secret\"\n# comment line\n"), 0644)

	LoadEnv()
	if os.Getenv("KILAT_TEST_VAR") != "super_secret" {
		t.Fatalf("expected KILAT_TEST_VAR to be 'super_secret', got %v", os.Getenv("KILAT_TEST_VAR"))
	}
}

func TestIsNewerVersion(t *testing.T) {
	if !isNewerVersion("3.0.0", "3.1.0") {
		t.Fatalf("3.1.0 should be newer than 3.0.0")
	}
	if isNewerVersion("3.1.0", "3.1.0") {
		t.Fatalf("3.1.0 should not be newer than 3.1.0")
	}
	if isNewerVersion("3.2.0", "3.1.0") {
		t.Fatalf("3.1.0 should not be newer than 3.2.0")
	}
}
