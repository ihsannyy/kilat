package engine

import (
	"os"
	"path/filepath"
	"testing"
)

func TestEngineExecution(t *testing.T) {
	rt := New(DefaultOptions())
	rt.SetGlobalRequire(".")

	val, err := rt.VM().RunString("1 + 2")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if val.ToInteger() != 3 {
		t.Fatalf("expected 3, got %v", val)
	}
}

func TestModulesBuiltin(t *testing.T) {
	rt := New(DefaultOptions())
	rt.SetGlobalRequire(".")

	code := `
		const os = require('os');
		const fs = require('fs');
		const crypto = require('crypto');
		if (!os || !fs || !crypto) {
			throw new Error("builtin module missing");
		}
		crypto.createHash('sha256').update('test').digest('hex');
	`
	_, err := rt.VM().RunString(code)
	if err != nil {
		t.Fatalf("builtin modules test failed: %v", err)
	}
}

func TestRunFile(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	jsFile := filepath.Join(tmpDir, "index.js")
	err = os.WriteFile(jsFile, []byte("globalThis.testVal = 42;"), 0644)
	if err != nil {
		t.Fatal(err)
	}

	rt := New(DefaultOptions())
	err = rt.RunFile(jsFile)
	if err != nil {
		t.Fatalf("RunFile failed: %v", err)
	}

	val := rt.VM().Get("testVal")
	if val == nil || val.ToInteger() != 42 {
		t.Fatalf("expected testVal to be 42, got %v", val)
	}
}

func TestTSCompilation(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_ts_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	tsFile := filepath.Join(tmpDir, "test.ts")
	tsCode := `
		interface Person { name: string }
		const p: Person = { name: "Kilat" };
		globalThis.personName = p.name;
	`
	err = os.WriteFile(tsFile, []byte(tsCode), 0644)
	if err != nil {
		t.Fatal(err)
	}

	rt := New(DefaultOptions())
	err = rt.RunFile(tsFile)
	if err != nil {
		t.Fatalf("RunFile TS failed: %v", err)
	}

	val := rt.VM().Get("personName")
	if val == nil || val.String() != "Kilat" {
		t.Fatalf("expected personName to be 'Kilat', got %v", val)
	}
}

func TestBuildFile(t *testing.T) {
	tmpDir, err := os.MkdirTemp("", "kilat_build_test_*")
	if err != nil {
		t.Fatal(err)
	}
	defer os.RemoveAll(tmpDir)

	inFile := filepath.Join(tmpDir, "in.ts")
	outFile := filepath.Join(tmpDir, "out.js")

	err = os.WriteFile(inFile, []byte("const add = (a: number, b: number) => a + b; console.log(add(2, 3));"), 0644)
	if err != nil {
		t.Fatal(err)
	}

	err = BuildFile(inFile, outFile)
	if err != nil {
		t.Fatalf("BuildFile failed: %v", err)
	}

	if _, err := os.Stat(outFile); os.IsNotExist(err) {
		t.Fatalf("output file was not created: %s", outFile)
	}
}
