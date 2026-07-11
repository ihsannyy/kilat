package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
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
	client := &http.Client{Timeout: 5 * time.Second}
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
