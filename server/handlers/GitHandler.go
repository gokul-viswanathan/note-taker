package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	gh "github.com/gokul-viswanathan/note-taker/server/github_action"
	"log"
	"net/http"
	"strings"
)

type OAuthRequest struct {
	Code string `json:"code"`
}

func OAuthCallback(c *gin.Context) {
	var req OAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	code := req.Code
	log.Println("Received code:", code)

	accesstoken := gh.Authentication(code)
	c.JSON(http.StatusOK, accesstoken)
}

func GetFiles(c *gin.Context) {
	// to get file paths
	user := c.Query("username")
	repo := c.Query("repo")
	subPath := c.Query("subpath")
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}

	output, err := gh.FileNames(c, user, repo, token, subPath)

	if err != nil {
		c.IndentedJSON(http.StatusBadGateway, "error happended")
		fmt.Println("Error occured during get files ", err)
	}
	c.IndentedJSON(http.StatusOK, output)
}

func GetFileContent(c *gin.Context) {
	// to get file content given the path - end with file ext
	user := c.Query("username")
	repo := c.Query("repo")
	path := c.Query("subpath") //path with the file name to get content
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}

	resp, err := gh.FileContent(c, user, repo, token, path)
	if err != nil {
		fmt.Println("Error occured during getting file content ", err)
		c.IndentedJSON(http.StatusBadGateway, "error happended")
		return
	}

	c.IndentedJSON(http.StatusOK, resp)
}

type RequestBody struct {
	Content       []Delta `json:"content"`
	SHA           string  `json:"sha"`
	CommitMessage string  `json:"commitmessage"`
}

type Delta struct {
	Insert     string         `json:"insert"`
	Attributes map[string]any `json:"attributes,omitempty"`
}

func CreateFolder(c *gin.Context) {
	// to create new file
	user := c.Query("username")
	repo := c.Query("repo")
	path := c.Query("path")
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}

	sha := ""
	currentUserObject := gh.NewGitHubClient(user, repo, token)
	resp, err := currentUserObject.CreateOrUpdateFolder(path, sha)

	if err != nil {
		fmt.Println("the creation or updation process was not completed Successfully :", err)
	}

	c.IndentedJSON(http.StatusOK, resp)
}
func CreateFiles(c *gin.Context) {
	// to create new file
	user := c.Query("username")
	repo := c.Query("repo")
	path := c.Query("path")
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}

	var body RequestBody

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	content := body.Content
	sha := body.SHA
	commitMessage := body.CommitMessage

	contentBytes, err := json.Marshal(content)
	if err != nil {
		fmt.Println("failed to marshal content:", err)
	}

	currentUserObject := gh.NewGitHubClient(user, repo, token)
	resp, err := currentUserObject.CreateOrUpdateFile(path, contentBytes, sha, commitMessage)

	if err != nil {
		fmt.Println("the creation or updation process was not completed Successfully :", err)
	}

	c.IndentedJSON(http.StatusOK, resp)
}

func DeleteFile(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	path := c.Query("path")
	sha := c.Query("sha")
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}
	fmt.Println("Delete file called on ", path)
	resp, err := gh.DeleteFile(user, repo, token, sha, path)
	if err != nil {
		fmt.Println("Error occured during file deletion ", err)
	}
	c.IndentedJSON(http.StatusOK, resp)
}

func DeleteFolder(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	path := c.Query("path")
	authHeader := c.GetHeader("Authorization")
	token := ""
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		token = strings.TrimPrefix(authHeader, "Bearer ")
	}
	fmt.Println("Delete folder called on ", path)
	resp, err := gh.DeleteDirectory(user, repo, token, path)
	if err != nil {
		fmt.Println("Error occured during file deletion ", err)
	}
	c.IndentedJSON(http.StatusOK, resp)
}
