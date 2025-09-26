package oauth

import (
	"encoding/json"
	"log"
	"net/http"
)

func UserInfo(token string) string {
	url := "https://api.github.com/user"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Accept", "application/vnd.github.v3+json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "client error"
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Fatal("error in getting user information")
	}

	return result["login"].(string)
}
