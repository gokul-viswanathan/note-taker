package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	gh "github.com/gokul-viswanathan/note-taker/server/github_action"
)

func GetFiles(c *gin.Context) {
	// to get file paths
	user := c.Query("username")
	repo := c.Query("repo")
	subPath := c.Query("subpath")
	token := c.GetHeader("Bearer")

	output, err := gh.FileNames(c, user, repo, token, subPath)

	if err != nil {
		log.Fatal("Error occured during get files", err)
	}
	c.IndentedJSON(http.StatusOK, output)
}

func GetFileContent(c *gin.Context) {
	// to get file content given the path - end with file ext
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("Bearer")
	path := c.Query("path") //path with the file name to get content

	resp, err := gh.FileContent(c, user, repo, token, path)
	if err != nil {
		log.Fatal("Error occured during getting file content ", err)
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

func CreateFiles(c *gin.Context) {
	// to create new file
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("Bearer")
	path := c.Query("path")

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
		log.Fatal("failed to marshal content:", err)
	}

	currentUserObject := gh.NewGitHubClient(user, repo, token)
	resp, err := currentUserObject.CreateOrUpdateFile(path, contentBytes, sha, commitMessage)

	if err != nil {
		log.Fatal("the creation or updation process was not completed Successfully :", err)
	}

	c.IndentedJSON(http.StatusOK, resp)
}

func DeleteFile(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("Bearer")
	path := c.Query("path")
	sha := c.Query("sha")

	resp, err := gh.DeleteFile(user, repo, token, sha, path)
	if err != nil {
		log.Fatal("Error occured during file deletion ", err)
	}
	c.IndentedJSON(http.StatusOK, resp)
}
