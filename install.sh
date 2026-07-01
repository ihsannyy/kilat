#!/bin/bash
# Kilat Installer - Fast JS Runtime for Termux

set -e

REPO="IHx-cmyk/kilat"
BINARY="kilat"
VERSION="v2.0.0"

# Warna
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}⚡ Kilat Installer${NC}"
echo ""

OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$ARCH" in
    aarch64|arm64)   ARCH="arm64" ;;
    x86_64|amd64)    ARCH="amd64" ;;
    armv7l|armhf)    ARCH="armv7" ;;
    *)
        echo -e "${RED}❌ Arsitektur tidak didukung: $ARCH${NC}"
        exit 1
        ;;
esac

if [ -d "$PREFIX/bin" ]; then
    BINDIR="$PREFIX/bin"
else
    BINDIR="/usr/local/bin"
fi

TMPDIR=$(mktemp -d)
cd "$TMPDIR"

URL="https://github.com/$REPO/releases/download/$VERSION/$BINARY-$OS-$ARCH"
echo -e "${CYAN}↳ Downloading $BINARY from GitHub...${NC}"
curl -fsSL -o "$BINARY" "$URL" || {
    echo -e "${RED}❌ Gagal download binary. Pastikan release $VERSION tersedia.${NC}"
    exit 1
}

chmod +x "$BINARY"

echo -e "${CYAN}↳ Installing to $BINDIR/$BINARY${NC}"
sudo mv "$BINARY" "$BINDIR/" 2>/dev/null || mv "$BINARY" "$BINDIR/"

cd - > /dev/null
rm -rf "$TMPDIR"

echo ""
echo -e "${GREEN}✅ Kilat $VERSION berhasil diinstall!${NC}"
echo -e "${BOLD}Gunakan:${NC} kilat --version"