package oauth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type GitHubTokenResponse struct {
	AccessToken string `json:"access_token"`
	Scope       string `json:"scope"`
	TokenType   string `json:"token_type"`
}

func TokenAuthentication(code string) string {

	clientID := "Ov23liJs7CaOYS4hDOqB"
	clientSecret := "2d42995c0213613a37d30a5c9220070e3b72a0b6"

	url := "https://github.com/login/oauth/access_token"
	payload := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}
	jsonPayload, _ := json.Marshal(payload)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonPayload))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "error"
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	var tokenResp GitHubTokenResponse
	if err := json.Unmarshal(bodyBytes, &tokenResp); err != nil {
		return "error"
	}

	if tokenResp.AccessToken == "" {
		log.Println("GitHub response:", string(bodyBytes))
		return "err"
	}

	fmt.Println("the access toke for the current user is ", tokenResp)

	return tokenResp.AccessToken
}
