package oauth

import (
	"fmt"
	"log"
	"net/http"
	"strings"
)

func checkRepoExists(username, repo, token string) bool {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s", username, repo)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return false
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return false
	}
	defer resp.Body.Close()
	fmt.Print("the body of checking if repo already exisits ", resp.Body)

	if resp.StatusCode == 200 {
		fmt.Println("Repo exists")
		return true
	}

	fmt.Println("Repo does not exist")
	return false
}

func createRepo(username, reponame, token string) bool {
	url := "https://api.github.com/user/repos"

	// token = "u"
	jsonBody := fmt.Sprintf(`{"name":"%s","private":true,"description":"Storage for Thought Ink notes application"}`, reponame)
	req, err := http.NewRequest("POST", url, strings.NewReader(jsonBody))
	if err != nil {
		fmt.Printf("Error creating request: %v\n", err)
		return false
	}

	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode == 201 {
		fmt.Println("Repo created successfully")
		return true
	}

	fmt.Printf("Failed to create repo, status code: %d\n", resp.StatusCode)
	return false
}

func UserRepoDetails(username, token string) string {
	REPO_NAME := "thoughtink-notepad-storage" // Fixed typo

	if checkRepoExists(username, REPO_NAME, token) {
		return REPO_NAME
	}

	if !createRepo(username, REPO_NAME, token) {
		log.Fatal("Issue in repo creation")
	}

	return REPO_NAME
}
