package github_action

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gokul-viswanathan/note-taker/server/utils"
)

func FileVersionContent(ctx context.Context, owner, repo, token, path, sha string) (FileContentStruct, error) {
	if owner == "" || repo == "" || token == "" || path == "" || sha == "" {
		return FileContentStruct{}, fmt.Errorf("owner, repo, token, path, and sha are required")
	}

	path = strings.Trim(path, "/")

	endpoint := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)
	params := url.Values{}
	params.Set("ref", sha)
	endpoint = endpoint + "?" + params.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "ThoughtInk/1.0")

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return FileContentStruct{}, fmt.Errorf("file not found for commit %s at %s/%s", sha, owner, repo)
	}
	if resp.StatusCode == http.StatusUnauthorized {
		return FileContentStruct{}, fmt.Errorf("authentication failed - check your token")
	}
	if resp.StatusCode == http.StatusForbidden {
		return FileContentStruct{}, fmt.Errorf("access forbidden - insufficient permissions")
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		return FileContentStruct{}, fmt.Errorf("GitHub API error: %s", resp.Status)
	}

	var fileContent utils.GithubFileContent
	if err := json.NewDecoder(resp.Body).Decode(&fileContent); err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to parse response JSON: %w", err)
	}

	if fileContent.Type != "file" {
		return FileContentStruct{}, fmt.Errorf("path %s is not a file (type: %s)", path, fileContent.Type)
	}

	decodedContent, err := decodeBase64Content(fileContent.Content)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to decode file content: %w", err)
	}

	return FileContentStruct{
		Name:    fileContent.Name,
		Path:    fileContent.Path,
		Sha:     fileContent.Sha,
		URL:     fileContent.URL,
		Content: decodedContent,
	}, nil
}
