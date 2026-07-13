package pkgmanager

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"kilat/internal/utils"
	"time"
)

func fetchPackageInfo(pkg string) (map[string]interface{}, error) {
	url := fmt.Sprintf("https://registry.npmjs.org/%s", pkg)
	client := utils.NewHTTPClient(15 * time.Second)
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("package tidak ditemukan (status %d)", resp.StatusCode)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	return data, err
}