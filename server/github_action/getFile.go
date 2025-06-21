package github_action

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gokul-viswanathan/note-taker/server/utils"
	"io"
	"net/http"
	"strings"
	"time"
)

func FileNames(ctx context.Context, owner, repo, token, path string) ([]utils.RepoItem, error) {
	path = strings.Trim(path, "/")
	var url string
	if path == "" {
		url = fmt.Sprintf("https://api.github.com/repos/%s/%s/contents", owner, repo)
	} else {
		url = fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)
	}

	// Create request with context
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+token) // Bearer is preferred over token
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "YourApp/1.0") // GitHub recommends setting User-Agent

	// Create client with timeout
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Make request
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Handle different HTTP status codes
	switch resp.StatusCode {
	case http.StatusOK:
		// Success - continue processing
	case http.StatusNotFound:
		return nil, fmt.Errorf("repository or path not found: %s/%s (path: %s)", owner, repo, path)
	case http.StatusUnauthorized:
		return nil, fmt.Errorf("authentication failed - check your token")
	case http.StatusForbidden:
		return nil, fmt.Errorf("access forbidden - insufficient permissions")
	default:
		return nil, fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
	}

	// Parse JSON response
	var contents []utils.GithubContent
	if err := json.Unmarshal(body, &contents); err != nil {
		// Try to parse as error response
		var errorResp struct {
			Message string `json:"message"`
			Errors  []struct {
				Message string `json:"message"`
			} `json:"errors,omitempty"`
		}

		if parseErr := json.Unmarshal(body, &errorResp); parseErr == nil {
			return nil, fmt.Errorf("GitHub API error: %s", errorResp.Message)
		}

		return nil, fmt.Errorf("failed to parse response as JSON: %w", err)
	}
	fmt.Print("the contents form Github ", contents)
	// Convert to RepoItem slice
	items := make([]utils.RepoItem, 0, len(contents))
	for _, item := range contents {
		items = append(items, utils.RepoItem{
			Name: item.Name,
			Type: item.Type,
			Path: item.Path, // Include full path if available in GithubContent
			Sha:  item.Sha,
			URL:  item.URL,
		})
	}

	return items, nil
}
