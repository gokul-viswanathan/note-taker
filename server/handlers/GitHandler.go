package handlers

import (
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

func CreateFiles(c *gin.Context) {
	// to create new file
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("Bearer")
	path := c.Query("path")

	resp := gh.CreateFiles(user, repo, token, path)
	c.IndentedJSON(http.StatusOK, resp)
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
