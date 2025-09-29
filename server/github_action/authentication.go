package github_action

import (
	"github.com/gokul-viswanathan/note-taker/server/github_action/oauth"
)

type userGithubData struct {
	username  string
	userrepo  string
	usertoken string
}

func Authentication(code string) userGithubData {

	userGitHubToken := oauth.TokenAuthentication(code)
	userGitHubName := oauth.UserInfo(userGitHubToken)
	userGitHubRepo := oauth.UserRepoDetails(userGitHubName, userGitHubToken)

	userData := userGithubData{userGitHubName, userGitHubRepo, userGitHubToken}
	return userData
}
