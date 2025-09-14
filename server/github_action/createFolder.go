package github_action

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func (g *GitHubClient) CreateOrUpdateFolder(path, sha string) (string, error) {
	// Default to creating a folder with .gitkeep if path is empty
	path = strings.TrimPrefix(path, "/")
	if path == "" {
		path = ".gitkeep" // Root-level .gitkeep
	} else {
		// Ensure we place .gitkeep inside the folder
		if !strings.HasSuffix(path, "/") {
			path += "/"
		}
		path += ".gitkeep"
	}

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", g.Owner, g.Repo, path)
	fmt.Println("the url is", url)

	// Empty file => Base64-encoded empty string
	content := base64.StdEncoding.EncodeToString([]byte(""))

	body := map[string]string{
		"message": fmt.Sprintf("Create empty %s", path),
		"content": content,
	}
	if sha != "" {
		body["sha"] = sha // only for updates
	}

	jsonBody, err := json.Marshal(body)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request body: %v", err)
	}

	// GitHub API uses PUT for create/update file
	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "token "+g.Token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return "", fmt.Errorf("GitHub API returned status: %s", resp.Status)
	}

	fmt.Println("Folder (via .gitkeep) created/updated successfully")
	return "success", nil
}
