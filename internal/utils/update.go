package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/fatih/color"
)

type UpdateCache struct {
	LastChecked   time.Time `json:"last_checked"`
	LatestVersion string    `json:"latest_version"`
}

func CheckUpdate() {
	home, err := os.UserHomeDir()
	if err != nil {
		return
	}

	kilatDir := filepath.Join(home, ".kilat")
	if err := os.MkdirAll(kilatDir, 0755); err != nil {
		return
	}

	cacheFile := filepath.Join(kilatDir, "update_cache.json")
	var cache UpdateCache

	data, err := ioutil.ReadFile(cacheFile)
	if err == nil {
		json.Unmarshal(data, &cache)
	}

	current := Version
	if cache.LatestVersion != "" && isNewerVersion(current, cache.LatestVersion) {
		color.Yellow("\n✨ Versi baru Kilat tersedia: %s (Versi saat ini: %s)", "v"+cache.LatestVersion, "v"+current)
		color.Cyan("👉 Perbarui dengan: curl -fsSL https://raw.githubusercontent.com/ihsannyy/kilat/main/install.sh | bash\n")
	}

	if time.Since(cache.LastChecked) > 24*time.Hour {
		go fetchLatestVersion(cacheFile, cache)
	}
}

func fetchLatestVersion(cacheFile string, cache UpdateCache) {
	client := NewHTTPClient(5 * time.Second)
	req, err := http.NewRequest("GET", "https://api.github.com/repos/ihsannyy/kilat/releases/latest", nil)
	if err != nil {
		return
	}
	req.Header.Set("User-Agent", "kilat-cli")

	resp, err := client.Do(req)
	if err != nil {
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return
	}

	var result struct {
		TagName string `json:"tag_name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return
	}

	latest := strings.TrimPrefix(result.TagName, "v")
	cache.LastChecked = time.Now()
	cache.LatestVersion = latest

	newData, err := json.Marshal(cache)
	if err == nil {
		ioutil.WriteFile(cacheFile, newData, 0644)
	}
}

func isNewerVersion(current, latest string) bool {
	cParts := strings.Split(current, ".")
	lParts := strings.Split(latest, ".")

	for i := 0; i < len(cParts) && i < len(lParts); i++ {
		var cVal, lVal int
		fmt.Sscanf(cParts[i], "%d", &cVal)
		fmt.Sscanf(lParts[i], "%d", &lVal)
		if lVal > cVal {
			return true
		}
		if cVal > lVal {
			return false
		}
	}
	return len(lParts) > len(cParts)
}

func SelfUpdate() {
	color.Cyan("🔄 Memulai pencarian rilis terbaru di GitHub...")

	client := NewHTTPClient(15 * time.Second)
	req, err := http.NewRequest("GET", "https://api.github.com/repos/ihsannyy/kilat/releases/latest", nil)
	if err != nil {
		color.Red("❌ Gagal membuat request: %v", err)
		return
	}
	req.Header.Set("User-Agent", "kilat-cli")

	resp, err := client.Do(req)
	if err != nil {
		color.Red("❌ Gagal menghubungi GitHub API: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		color.Red("❌ GitHub API memberikan status: %d", resp.StatusCode)
		return
	}

	var result struct {
		TagName string `json:"tag_name"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		color.Red("❌ Gagal membaca respon data JSON: %v", err)
		return
	}

	latestVersion := strings.TrimPrefix(result.TagName, "v")
	if !isNewerVersion(Version, latestVersion) {
		color.Green("✅ Kilat Anda sudah menggunakan versi terbaru (v%s)!", Version)
		return
	}

	color.Yellow("✨ Menemukan versi baru: v%s. Memulai proses pengunduhan...", latestVersion)

	osName := runtime.GOOS
	archName := runtime.GOARCH

	if archName == "arm" {
		archName = "armv7"
	}

	assetName := fmt.Sprintf("kilat-%s-%s", osName, archName)
	downloadURL := fmt.Sprintf("https://github.com/ihsannyy/kilat/releases/download/%s/%s", result.TagName, assetName)

	color.Cyan("📡 Mengunduh biner: %s", downloadURL)

	binResp, err := client.Get(downloadURL)
	if err != nil {
		color.Red("❌ Gagal mengunduh biner: %v", err)
		return
	}
	defer binResp.Body.Close()

	if binResp.StatusCode != http.StatusOK {
		color.Red("❌ Gagal mengunduh biner (Status: %d).", binResp.StatusCode)
		return
	}

	exePath, err := os.Executable()
	if err != nil {
		color.Red("❌ Gagal melacak lokasi biner kilat aktif: %v", err)
		return
	}

	oldPath := exePath + ".old"
	_ = os.Remove(oldPath)

	err = os.Rename(exePath, oldPath)
	if err != nil {
		color.Red("❌ Gagal merename biner aktif untuk pertukaran: %v", err)
		return
	}

	out, err := os.OpenFile(exePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0755)
	if err != nil {
		color.Red("❌ Gagal membuat biner baru: %v. Mencoba mengembalikan biner lama...", err)
		_ = os.Rename(oldPath, exePath)
		return
	}
	defer out.Close()

	_, err = io.Copy(out, binResp.Body)
	if err != nil {
		color.Red("❌ Gagal menulis data biner baru: %v. Mencoba mengembalikan biner lama...", err)
		_ = os.Rename(oldPath, exePath)
		return
	}

	_ = os.Remove(oldPath)

	color.Green("✅ Kilat berhasil diperbarui ke v%s!", latestVersion)
}
