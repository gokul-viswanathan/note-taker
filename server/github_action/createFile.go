package github_action

import (
	"bytes"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
)

type GithubData struct {
	fileName    string
	fileContent string
	user        string
	repo        string
	path        string
}

func CreateFiles(data string) {

	owner := "gokul-viswanathan"
	repo := "notesTester"
	filePath := "test2.json"
	token := "xxx"

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, filePath)

	data = b64.StdEncoding.EncodeToString([]byte("Hello from Go!"))

	payload := map[string]interface{}{
		"message": "Create hello.txt in nested folder",
		"content": data,
		"branch":  "main",
	}

	jsonData, _ := json.Marshal(payload)

	req, _ := http.NewRequest("PUT", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Request failed:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)

}
