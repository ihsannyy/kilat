#!/bin/sh
# Kilat Installer - Fast JS Runtime for Termux, Linux, macOS, and Windows
set -e

REPO="cilldev/kilat"
BINARY="kilat"
VERSION="v3.1.0"

RED='\033[0;31m'
GREEN='\033[0;32m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[0;37m'
BOLD='\033[1m'
NC='\033[0m'

draw_progress_bar() {
	local percent=$1
	local status=$2
	local width=20
	local completed=$(( percent * width / 100 ))
	local bar=""
	for i in $(seq 1 $width); do
		if [ "$i" -le "$completed" ]; then
			bar="${bar}█"
		else
			bar="${bar}░"
		fi
	done
	printf "\r\033[K\033[0;36m⚡\033[0m  \033[0;37m%-40s\033[0m \033[0;36m→\033[0m [\033[0;35m%3d%%\033[0m] [\033[0;35m%-20s\033[0m]" "$status" "$percent" "$bar"
}

echo -e "${MAGENTA}${BOLD}⚡ Kilat Installer${NC}"
echo ""

# Detect OS
RAW_OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$RAW_OS" in
	linux*)
		OS="linux"
		;;
	darwin*)
		OS="darwin"
		;;
	msys*|mingw*|cygwin*|windows*)
		OS="windows"
		;;
	*)
		OS="$RAW_OS"
		;;
esac

# Detect Architecture
RAW_ARCH=$(uname -m)
case "$RAW_ARCH" in
	aarch64|arm64)   ARCH="arm64" ;;
	x86_64|amd64)    ARCH="amd64" ;;
	armv7l|armhf)    ARCH="armv7" ;;
	i386|i686)       ARCH="386" ;;
	*)
		echo -e "${RED}❌ Arsitektur tidak didukung: $RAW_ARCH${NC}"
		exit 1
		;;
esac

# Determine binary file name and target bin directory
TARGET_NAME="kilat"
if [ "$OS" = "windows" ]; then
	TARGET_NAME="kilat.exe"
fi

if [ -n "$PREFIX" ] && [ -d "$PREFIX/bin" ]; then
	# Termux environment
	BINDIR="$PREFIX/bin"
elif [ -d "/usr/local/bin" ] && ( [ -w "/usr/local/bin" ] || command -v sudo >/dev/null 2>&1 ); then
	BINDIR="/usr/local/bin"
elif [ -d "$HOME/.local/bin" ]; then
	BINDIR="$HOME/.local/bin"
else
	BINDIR="$HOME/.local/bin"
	mkdir -p "$BINDIR"
fi

TMPDIR=$(mktemp -d 2>/dev/null || mktemp -d -t 'kilat')
cd "$TMPDIR"

ASSET_NAME="$BINARY-$OS-$ARCH"
if [ "$OS" = "windows" ]; then
	ASSET_NAME="$ASSET_NAME.exe"
fi

URL="https://github.com/$REPO/releases/download/$VERSION/$ASSET_NAME"

curl -fsSL -o "$TARGET_NAME" "$URL" &
CURL_PID=$!

percent=10
while kill -0 $CURL_PID 2>/dev/null; do
	draw_progress_bar $percent "Downloading kilat ($OS/$ARCH)..."
	sleep 0.1
	if [ $percent -lt 90 ]; then
		percent=$((percent + 3))
	fi
done

wait $CURL_PID
if [ $? -ne 0 ]; then
	printf "\n${RED}❌ Gagal download binary ($ASSET_NAME). Pastikan rilis $VERSION tersedia.${NC}\n"
	rm -rf "$TMPDIR"
	exit 1
fi
draw_progress_bar 90 "Downloading kilat ($OS/$ARCH)..."
sleep 0.1

draw_progress_bar 95 "Installing binary to $BINDIR..."
chmod +x "$TARGET_NAME"
sleep 0.1

if [ -w "$BINDIR" ]; then
	mv "$TARGET_NAME" "$BINDIR/"
else
	if command -v sudo >/dev/null 2>&1; then
		sudo mv "$TARGET_NAME" "$BINDIR/"
	else
		mv "$TARGET_NAME" "$BINDIR/"
	fi
fi

draw_progress_bar 100 "Installing binary to $BINDIR..."
echo ""

cd - > /dev/null
rm -rf "$TMPDIR"

echo ""
echo -e "${MAGENTA}✨ Kilat $VERSION berhasil diinstall ke ${BOLD}$BINDIR/$TARGET_NAME${NC}!"

# Verify if BINDIR is in PATH
case ":$PATH:" in
	*":$BINDIR:"*)
		;;
	*)
		echo -e "${RED}⚠️  Catatan: $BINDIR belum ada di PATH Anda.${NC}"
		echo -e "${CYAN}Tambahkan baris ini ke file ~/.bashrc atau ~/.zshrc Anda:${NC}"
		echo -e "   export PATH=\"$BINDIR:\$PATH\""
		;;
esac

echo -e "${CYAN}${BOLD}Jalankan perintah:${NC} kilat --version"