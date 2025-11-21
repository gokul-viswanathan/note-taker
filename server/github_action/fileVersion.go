package github_action

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type commitUser struct {
	Name  string    `json:"name"`
	Email string    `json:"email"`
	Date  time.Time `json:"date"`
}

type commitParent struct {
	Sha string `json:"sha"`
}

type commitPayload struct {
	Sha     string `json:"sha"`
	HtmlURL string `json:"html_url"`
	Commit  struct {
		Message   string     `json:"message"`
		Author    commitUser `json:"author"`
		Committer commitUser `json:"committer"`
	} `json:"commit"`
	Parents []commitParent `json:"parents"`
}

type FileVersion struct {
	Sha       string     `json:"sha"`
	Message   string     `json:"message"`
	HtmlURL   string     `json:"htmlUrl"`
	Author    commitUser `json:"author"`
	Committer commitUser `json:"committer"`
	Parents   []string   `json:"parents"`
}

func FileVersions(ctx context.Context, owner, repo, token, path, branch string, limit int) ([]FileVersion, error) {
	if owner == "" || repo == "" || token == "" || path == "" {
		return nil, fmt.Errorf("owner, repo, token, and path are required")
	}

	path = strings.Trim(path, "/")
	branch = strings.TrimSpace(branch)

	if limit <= 0 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	query := url.Values{}
	query.Set("path", path)
	query.Set("per_page", strconv.Itoa(limit))
	if branch != "" {
		query.Set("sha", branch)
	}

	endpoint := fmt.Sprintf("https://api.github.com/repos/%s/%s/commits?%s", owner, repo, query.Encode())

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("User-Agent", "ThoughtInk/1.0")

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("repository or file not found: %s/%s (path: %s)", owner, repo, path)
	}
	if resp.StatusCode == http.StatusUnauthorized {
		return nil, fmt.Errorf("authentication failed - check your token")
	}
	if resp.StatusCode == http.StatusForbidden {
		return nil, fmt.Errorf("access forbidden - insufficient permissions")
	}
	if resp.StatusCode < 200 || resp.StatusCode > 299 {
		return nil, fmt.Errorf("GitHub API error: %s", resp.Status)
	}

	var payload []commitPayload
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return nil, fmt.Errorf("failed to parse response JSON: %w", err)
	}

	versions := make([]FileVersion, 0, len(payload))
	for _, item := range payload {
		current := FileVersion{
			Sha:       item.Sha,
			Message:   item.Commit.Message,
			HtmlURL:   item.HtmlURL,
			Author:    item.Commit.Author,
			Committer: item.Commit.Committer,
		}

		if len(item.Parents) > 0 {
			current.Parents = make([]string, 0, len(item.Parents))
			for _, parent := range item.Parents {
				current.Parents = append(current.Parents, parent.Sha)
			}
		}

		versions = append(versions, current)
	}

	return versions, nil
}
