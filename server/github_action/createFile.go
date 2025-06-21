package github_action

import (
	"bytes"
	b64 "encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"
	"strings"
)

// GitHubClient represents a GitHub API client
type GitHubClient struct {
	Owner string
	Repo  string
	Token string
}

// FileContent represents the structure of GitHub file content response
type FileContents struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	SHA         string `json:"sha"`
	Size        int    `json:"size"`
	URL         string `json:"url"`
	HTMLURL     string `json:"html_url"`
	GitURL      string `json:"git_url"`
	DownloadURL string `json:"download_url"`
	Type        string `json:"type"`
	Content     string `json:"content"`
	Encoding    string `json:"encoding"`
}

// NewGitHubClient creates a new GitHub client
func NewGitHubClient(owner, repo, token string) *GitHubClient {
	return &GitHubClient{
		Owner: owner,
		Repo:  repo,
		Token: token,
	}
}

// CreateOrUpdateFile creates a new file or updates an existing one
func (g *GitHubClient) CreateOrUpdateFile(path string, content []byte, sha, commitMessage string) (string, error) {
	// Ensure proper path formatting

	encodedContent := b64.StdEncoding.EncodeToString(content)

	if commitMessage == "" {
		if sha == "" {
			commitMessage = fmt.Sprintf("Create %s", filepath.Base(path))
		} else {
			commitMessage = fmt.Sprintf("Update %s", filepath.Base(path))
		}
	}

	payload := map[string]interface{}{
		"message": commitMessage,
		"content": encodedContent,
		"branch":  "main",
	}

	// Include SHA only if file exists (for updates)
	if sha != "" {
		payload["sha"] = sha
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal JSON: %v", err)
	}

	path = strings.TrimPrefix(path, "/")
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", g.Owner, g.Repo, path)

	fmt.Println("the data sent to GIT ", bytes.NewBuffer(jsonData))

	req, err := http.NewRequest(
		"PUT",
		url,
		bytes.NewBuffer(jsonData),
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
