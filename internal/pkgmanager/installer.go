package pkgmanager

import (
	"archive/tar"
	"compress/gzip"
	"fmt"
	"io"
	"kilat/internal/utils"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func downloadAndExtractLight(tarballURL, targetDir string) error {
	client := utils.NewHTTPClient(30 * time.Second)
	resp, err := client.Get(tarballURL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return fmt.Errorf("gagal download: status %d", resp.StatusCode)
	}

	gz, err := gzip.NewReader(resp.Body)
	if err != nil {
		return err
	}
	defer gz.Close()

	tarReader := tar.NewReader(gz)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		path := strings.TrimPrefix(header.Name, "package/")
		if path == "" {
			continue
		}
		if !strings.HasSuffix(path, ".js") && path != "package.json" {
			continue
		}

		fullPath := filepath.Join(targetDir, path)
		switch header.Typeflag {
		case tar.TypeDir:
			os.MkdirAll(fullPath, 0755)
		case tar.TypeReg:
			os.MkdirAll(filepath.Dir(fullPath), 0755)
			f, err := os.Create(fullPath)
			if err != nil {
				return err
			}
			if _, err := io.Copy(f, tarReader); err != nil {
				f.Close()
				return err
			}
			f.Close()
		}
	}
	return nil
}