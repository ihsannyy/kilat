#!/bin/bash
set -e

echo "Building Kilat binaries..."

CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o kilat-linux-amd64 ./cmd/kilat
echo "  ✓ linux/amd64"

CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -o kilat-linux-arm64 ./cmd/kilat
echo "  ✓ linux/arm64"

CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -o kilat-darwin-amd64 ./cmd/kilat
echo "  ✓ darwin/amd64"

CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -o kilat-darwin-arm64 ./cmd/kilat
echo "  ✓ darwin/arm64"

CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -o kilat-windows-amd64.exe ./cmd/kilat
echo "  ✓ windows/amd64"

echo ""
echo "Done! Binaries:"
ls -lh kilat-*
