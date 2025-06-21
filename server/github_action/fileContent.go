package github_action

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/gokul-viswanathan/note-taker/server/utils"
)

type FileContentStruct struct {
	Name    string `json:"name"`
	Path    string `json:"path"`
	Sha     string `json:"sha"`
	URL     string `json:"url"`
	Content string `json:"content"`
}

func FileContent(ctx context.Context, owner string, repo string, token string, path string) (FileContentStruct, error) {

	if owner == "" || repo == "" || token == "" || path == "" {
		return FileContentStruct{}, fmt.Errorf("owner, repo, token, and path are required")
	}
	path = strings.Trim(path, "/")
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)
	fmt.Print("the URL is ", url)
	// Create request with context
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "YourApp/1.0")

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Make request
	resp, err := client.Do(req)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to read response body: %w", err)
	}

	// fmt.Print("the body of the request is ", body)

	// Handle different HTTP status codes
	switch resp.StatusCode {
	case http.StatusOK:
		// Success - continue processing
	case http.StatusNotFound:
		return FileContentStruct{}, fmt.Errorf("file not found: %s in %s/%s", path, owner, repo)
	case http.StatusUnauthorized:
		return FileContentStruct{}, fmt.Errorf("authentication failed - check your token")
	case http.StatusForbidden:
		return FileContentStruct{}, fmt.Errorf("access forbidden - insufficient permissions")
	default:
		// Try to parse error response
		var errorResp struct {
			Message string `json:"message"`
		}
		if json.Unmarshal(body, &errorResp) == nil && errorResp.Message != "" {
			return FileContentStruct{}, fmt.Errorf("GitHub API error (%d): %s", resp.StatusCode, errorResp.Message)
		}
		return FileContentStruct{}, fmt.Errorf("API request failed with status %d", resp.StatusCode)
	}

	// Parse JSON response
	var fileContent utils.GithubFileContent
	if err := json.Unmarshal(body, &fileContent); err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to parse response JSON: %w", err)
	}

	// Check if it's actually a file (not a directory)
	if fileContent.Type != "file" {
		return FileContentStruct{}, fmt.Errorf("path %s is not a file (type: %s)", path, fileContent.Type)
	}

	// Decode base64 content nd return SHA maybe
	decodedContent, err := decodeBase64Content(fileContent.Content)
	if err != nil {
		return FileContentStruct{}, fmt.Errorf("failed to decode file content: %w", err)
	}

	contentOutput := FileContentStruct{
		Name:    fileContent.Name,
		Path:    fileContent.Path,
		Sha:     fileContent.Sha,
		URL:     fileContent.URL,
		Content: decodedContent,
	}

	return contentOutput, nil
}

// decodeBase64Content handles the base64 decoding with proper cleanup
func decodeBase64Content(encodedContent string) (string, error) {
	// Remove newlines and whitespace from base64 content
	cleanContent := strings.ReplaceAll(encodedContent, "\n", "")
	cleanContent = strings.ReplaceAll(cleanContent, "\r", "")
	cleanContent = strings.TrimSpace(cleanContent)

	// Decode base64
	decoded, err := base64.StdEncoding.DecodeString(cleanContent)
	if err != nil {
		return "", fmt.Errorf("base64 decode error: %w", err)
	}

	return string(decoded), nil
}
