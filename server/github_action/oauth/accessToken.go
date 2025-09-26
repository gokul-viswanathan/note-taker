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

	clientID := "Iv23liOSDKA05BdSC59m"
	clientSecret := "87343b07f75baa54d6d456cda7444443495be641"

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

	fmt.Println("the access toke for the current user is ", tokenResp.AccessToken)

	//1) get user info with the token
	//2) check if repo exisitis
	// yes: return back with username, reponame, token and save it
	// no: create a repo and handle everything.
	return tokenResp.AccessToken
}
