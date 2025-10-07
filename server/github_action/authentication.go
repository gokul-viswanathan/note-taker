package github_action

import (
	"fmt"

	"github.com/gokul-viswanathan/note-taker/server/github_action/oauth"
)

type userGithubData struct {
	UserGitHubName  string `json:"username"`
	UserGitHubRepo  string `json:"repo"`
	UserGitHubToken string `json:"token"`
}

func Authentication(code string) userGithubData {

	userGitHubToken := oauth.TokenAuthentication(code)
	userGitHubName := oauth.UserInfo(userGitHubToken)
	userGitHubRepo := oauth.UserRepoDetails(userGitHubName, userGitHubToken)

	userData := userGithubData{
		UserGitHubName:  userGitHubName,
		UserGitHubRepo:  userGitHubRepo,
		UserGitHubToken: userGitHubToken,
	}
	fmt.Println("the user data is ", userData)
	return userData
}
