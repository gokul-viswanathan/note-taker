package github_action

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type GithubContent struct {
	Name        string `json:"name"`
	Path        string `json:"path"`
	Sha         string `json:"sha"`
	Size        int    `json:"size"`
	URL         string `json:"url"`
	HTMLURL     string `json:"html_url"`
	GitURL      string `json:"git_url"`
	DownloadURL string `json:"download_url"`
	Type        string `json:"type"`
	Links       struct {
		Self string `json:"self"`
		Git  string `json:"git"`
		HTML string `json:"html"`
	} `json:"_links"`
}

type RepoItem struct {
	Name string `json:"name"`
	Type string `json:"type"` // "file" or "dir" typically
}

func FileNames(owner string, repo string, token string) ([]RepoItem, error) {

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/", owner, repo)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		log.Fatal("Error in get file name request ", err)
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)

	if err != nil {
		log.Fatal("Error in getting response body ", err)
	}

	var contents []GithubContent
	err = json.Unmarshal(body, &contents)

	if err != nil {
		// If it's not an array, it might be an error response or different structure
		var errorResp map[string]interface{}
		err = json.Unmarshal(body, &errorResp)
		if err != nil {
			log.Fatal("Failed to parse response:", err)
		}
		fmt.Println("API response for incorrect API structure:", errorResp)
	}

	items := make([]RepoItem, 0, len(contents))
	for _, item := range contents {
		items = append(items, RepoItem{
			Name: item.Name,
			Type: item.Type,
		})
	}

	return items, nil
}
