package pkgmanager

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fatih/color"
)

const installDir = ".kilat/packages"

type PackageJSON struct {
	Name            string            `json:"name"`
	Version         string            `json:"version"`
	Description     string            `json:"description"`
	Main            string            `json:"main"`
	Author          string            `json:"author"`
	License         string            `json:"license"`
	Dependencies    map[string]string `json:"dependencies"`
	DevDependencies map[string]string `json:"devDependencies"`
}

type InstallProgress struct {
	status    string
	percent   int
	startTime time.Time
	done      chan struct{}
}

func drawProgressBar(percent int, status string, elapsed time.Duration) {
	width := 20
	completed := percent * width / 100
	var bar strings.Builder
	for i := 0; i < width; i++ {
		if i < completed {
			bar.WriteString("█")
		} else {
			bar.WriteString("░")
		}
	}
	elapsedSec := int(elapsed.Seconds())
	fmt.Printf("\r\033[K%s  %-40s %s [%3d%%] [%-20s] (%ds)",
		color.CyanString("⚡"),
		color.WhiteString(status),
		color.CyanString("→"),
		percent,
		color.MagentaString(bar.String()),
		elapsedSec,
	)
}

func startProgress(initialStatus string, initialPercent int) *InstallProgress {
	ip := &InstallProgress{
		status:    initialStatus,
		percent:   initialPercent,
		startTime: time.Now(),
		done:      make(chan struct{}),
	}
	go func() {
		ticker := time.NewTicker(100 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-ip.done:
				return
			case <-ticker.C:
				drawProgressBar(ip.percent, ip.status, time.Since(ip.startTime))
			}
		}
	}()
	return ip
}

func (ip *InstallProgress) update(status string, percent int) {
	ip.status = status
	ip.percent = percent
	drawProgressBar(percent, status, time.Since(ip.startTime))
}

func (ip *InstallProgress) stop(success bool, pkgName string, version string) {
	close(ip.done)
	fmt.Print("\r\033[K")
	elapsed := time.Since(ip.startTime).Round(time.Second)
	if success {
		color.Magenta("✨ %s@%s berhasil diinstall (selesai dalam %s)", pkgName, version, elapsed)
		color.Cyan("   📦 Lokasi: .kilat/packages/%s", pkgName)
	}
}

func (ip *InstallProgress) stopRemove(success bool, pkgName string) {
	close(ip.done)
	fmt.Print("\r\033[K")
	elapsed := time.Since(ip.startTime).Round(time.Second)
	if success {
		color.Magenta("✨ %s berhasil dihapus (selesai dalam %s)", pkgName, elapsed)
	}
}

func Add(pkgName string) error {
	pkgFile := "package.json"
	var pkg PackageJSON

	if data, err := ioutil.ReadFile(pkgFile); err == nil {
		if err := json.Unmarshal(data, &pkg); err != nil {
			return fmt.Errorf("gagal parse package.json: %w", err)
		}
	} else {
		wd, _ := os.Getwd()
		pkg = PackageJSON{
			Name:            filepath.Base(wd),
			Version:         "1.0.0",
			Description:     "",
			Main:            "index.js",
			Author:          "",
			License:         "MIT",
			Dependencies:    make(map[string]string),
			DevDependencies: make(map[string]string),
		}
	}
	if pkg.Dependencies == nil {
		pkg.Dependencies = make(map[string]string)
	}

	ip := startProgress("Mengambil info package...", 10)

	info, err := fetchPackageInfo(pkgName)
	if err != nil {
		ip.stop(false, "", "")
		return err
	}
	latestVersion := info["dist-tags"].(map[string]interface{})["latest"].(string)
	versionInfo := info["versions"].(map[string]interface{})[latestVersion].(map[string]interface{})
	tarballURL := versionInfo["dist"].(map[string]interface{})["tarball"].(string)

	ip.update(fmt.Sprintf("Mengunduh %s@%s...", pkgName, latestVersion), 50)

	targetDir := filepath.Join(installDir, pkgName)
	os.MkdirAll(targetDir, 0755)

	if err := downloadAndExtractLight(tarballURL, targetDir); err != nil {
		ip.stop(false, "", "")
		return err
	}

	ip.update("Menyimpan konfigurasi...", 90)
	time.Sleep(200 * time.Millisecond)

	pkg.Dependencies[pkgName] = latestVersion
	data, _ := json.MarshalIndent(pkg, "", "  ")
	ioutil.WriteFile(pkgFile, data, 0644)

	ip.stop(true, pkgName, latestVersion)
	return nil
}

func Remove(pkgName string) error {
	pkgFile := "package.json"
	data, err := ioutil.ReadFile(pkgFile)
	if err != nil {
		return fmt.Errorf("tidak menemukan package.json di folder aktif")
	}

	var pkg PackageJSON
	if err := json.Unmarshal(data, &pkg); err != nil {
		return fmt.Errorf("gagal parse package.json: %w", err)
	}

	if pkg.Dependencies == nil || pkg.Dependencies[pkgName] == "" {
		return fmt.Errorf("package '%s' tidak ditemukan di daftar dependencies", pkgName)
	}

	ip := startProgress(fmt.Sprintf("Menghapus %s...", pkgName), 30)

	targetDir := filepath.Join(installDir, pkgName)
	if err := os.RemoveAll(targetDir); err != nil {
		ip.stopRemove(false, "")
		return fmt.Errorf("gagal menghapus folder modul: %w", err)
	}

	ip.update("Membersihkan konfigurasi...", 80)
	delete(pkg.Dependencies, pkgName)
	newData, _ := json.MarshalIndent(pkg, "", "  ")
	_ = ioutil.WriteFile(pkgFile, newData, 0644)

	ip.stopRemove(true, pkgName)
	return nil
}
