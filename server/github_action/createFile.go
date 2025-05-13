package github_action

import (
	"bytes"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func CreateFiles(owner string, repo string, token string, path string) string {

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)

	data := b64.StdEncoding.EncodeToString([]byte("The content of the file is changed"))

	//sha is required for file update

	payload := map[string]interface{}{
		"message": "Create file3 in nested folder",
		"content": data,
		"branch":  "main",
		"sha":     "",
	}

	jsonData, _ := json.Marshal(payload)

	req, _ := http.NewRequest("PUT", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Request failed:", err)
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)

	return resp.Status

}
