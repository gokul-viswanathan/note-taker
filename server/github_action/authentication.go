package github_action

import (
	"fmt"
	"github.com/gokul-viswanathan/note-taker/server/github_action/oauth"
)

func Authentication(code string) string {

	userGitHubToken := oauth.TokenAuthentication(code)
	userGitHubName := oauth.UserInfo(userGitHubToken)
	userGitHubRepo := oauth.UserRepoDetails(userGitHubName, userGitHubToken)

	// pack this and sent to frontend
	fmt.Println(userGitHubToken, userGitHubName, userGitHubRepo)
	return userGitHubToken
}
