package oauth

import (
	"fmt"
	"log"
	"net/http"
)

func checkRepoExists(username, repo, token string) bool {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s", username, repo)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil && resp.StatusCode != 200 {
		return false
	}
	return true
}

func createRepo(username, reponame, token string) bool {
	url := fmt.Sprintf("https://api.github.com/%s/%s", username, reponame)

	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("Content-type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil && resp.StatusCode != 200 {
		return false
	}
	return true
}

func UserRepoDetails(username, token string) string {
	REPO_NAME := "thougtink-notepad-storage"

	if checkRepoExists(username, REPO_NAME, token) {
		return REPO_NAME
	}

	if !createRepo(username, REPO_NAME, token) {
		log.Fatal("Issue in repo creation")
	}
	return REPO_NAME
}
