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
		return "", fmt.Errorf("failed to delete : %v", err)
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

type FileInfo struct {
	Name string `json:"name"`
	Path string `json:"path"`
	SHA  string `json:"sha"`
	Type string `json:"type"`
}

// GetDirectoryContents retrieves all files in a directory (recursively)
func GetDirectoryContents(user, repo, token, dirPath string) ([]FileInfo, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", user, repo, dirPath)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("failed to get directory contents: %s", string(body))
	}

	var contents []FileInfo
	if err := json.NewDecoder(resp.Body).Decode(&contents); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	var allFiles []FileInfo

	// Process each item in the directory
	for _, item := range contents {
		switch item.Type {
		case "file":
			allFiles = append(allFiles, item)
		case "dir":
			// Recursively get files from subdirectories
			subFiles, err := GetDirectoryContents(user, repo, token, item.Path)
			if err != nil {
				return nil, fmt.Errorf("failed to get subdirectory %s: %v", item.Path, err)
			}
			allFiles = append(allFiles, subFiles...)
		}
	}

	return allFiles, nil
}

// DeleteDirectory deletes an entire directory by deleting all files within it
func DeleteDirectory(user, repo, token, dirPath string) (string, error) {
	// First, get all files in the directory
	files, err := GetDirectoryContents(user, repo, token, dirPath)
	if err != nil {
		return "", fmt.Errorf("failed to get directory contents: %v", err)
	}

	if len(files) == 0 {
		return "Directory is empty or doesn't exist", nil
	}

	// Delete each file
	var deletedFiles []string
	var errors []string

	for _, file := range files {
		_, err := DeleteFile(user, repo, token, file.SHA, file.Path)
		if err != nil {
			errors = append(errors, fmt.Sprintf("Failed to delete %s: %v", file.Path, err))
		} else {
			deletedFiles = append(deletedFiles, file.Path)
		}
	}

	// Prepare result message
	resultMsg := fmt.Sprintf("Directory deletion completed. Deleted %d files", len(deletedFiles))

	if len(errors) > 0 {
		resultMsg += fmt.Sprintf(", %d errors occurred", len(errors))
		return resultMsg, fmt.Errorf("some files failed to delete: %v", errors)
	}

	return resultMsg, nil
}
