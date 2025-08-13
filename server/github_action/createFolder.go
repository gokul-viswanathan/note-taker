package github_action

import (
	"bytes"
	"fmt"
	"net/http"
	"strings"
)

// CreateOrUpdateFile creates a new file or updates an existing one
func (g *GitHubClient) CreateOrUpdateFolder(path, sha string) (string, error) {

	path = strings.TrimPrefix(path, "/")
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", g.Owner, g.Repo, path)
	fmt.Println("the url is ", url)
	req, err := http.NewRequest(
		"POST",
		url,
		bytes.NewBuffer([]byte{}), // No body needed for folder creation
	)
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

	fmt.Println("the response from Github is ", resp)
	return "success", nil
}
