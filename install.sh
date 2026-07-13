#!/bin/bash
# Kilat Installer - Fast JS Runtime for Termux

set -e

REPO="ihsannyy/kilat"
BINARY="kilat"
VERSION="v3.1.0"

RED='\033[0;31m'
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
	for ((i=0; i<width; i++)); do
		if [ $i -lt $completed ]; then
			bar="${bar}█"
		else
			bar="${bar}░"
		fi
	done
	printf "\r\033[K\033[0;36m⚡\033[0m  \033[0;37m%-40s\033[0m \033[0;36m→\033[0m [\033[0;35m%3d%%\033[0m] [\033[0;35m%-20s\033[0m]" "$status" "$percent" "$bar"
}

echo -e "${MAGENTA}${BOLD}⚡ Kilat Installer${NC}"
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

curl -fsSL -o "$BINARY" "$URL" &
CURL_PID=$!

percent=10
while kill -0 $CURL_PID 2>/dev/null; do
	draw_progress_bar $percent "Downloading kilat from GitHub..."
	sleep 0.1
	if [ $percent -lt 90 ]; then
		percent=$((percent + 3))
	fi
done

wait $CURL_PID
if [ $? -ne 0 ]; then
	printf "\n${RED}❌ Gagal download binary. Pastikan release $VERSION tersedia.${NC}\n"
	exit 1
fi
draw_progress_bar 90 "Downloading kilat from GitHub..."
sleep 0.1

draw_progress_bar 95 "Installing binary to path..."
chmod +x "$BINARY"
sleep 0.1

if [ -w "$BINDIR" ]; then
	mv "$BINARY" "$BINDIR/"
else
	if command -v sudo >/dev/null 2>&1; then
		sudo mv "$BINARY" "$BINDIR/"
	else
		mv "$BINARY" "$BINDIR/"
	fi
fi

draw_progress_bar 100 "Installing binary to path..."
echo ""

cd - > /dev/null
rm -rf "$TMPDIR"

echo ""
echo -e "${MAGENTA}✨ Kilat $VERSION berhasil diinstall!${NC}"
echo -e "${CYAN}${BOLD}Gunakan:${NC} kilat --version"