package github_action

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
)

// DeleteFile deletes a file from the repository
func DeleteFile(user, repo, token, sha, path string) (string, error) {

	//passing SHA throught the filename path.

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", user, repo, path)

	commitMessage := ""

	if commitMessage == "" {
		commitMessage = fmt.Sprintf("Delete %s", filepath.Base(path))
	}

	payload := map[string]interface{}{
		"message": commitMessage,
		"sha":     sha,
		"branch":  "main",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal JSON: %v", err)
	}

	req, err := http.NewRequest("DELETE", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return fmt.Sprintf("Deleted: %s", resp.Status), nil
	} else {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Sprintf("Failed: %s", resp.Status), fmt.Errorf("delete failed: %s", string(body))
	}
}
