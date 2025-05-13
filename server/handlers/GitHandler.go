package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	gh "github.com/gokul-viswanathan/note-taker/server/github_action"
)

func GetFiles(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("token")

	output, err := gh.FileNames(user, repo, token)

	if err != nil {
		log.Fatal("Error occured during get files", err)
	}
	c.IndentedJSON(http.StatusOK, output)
}

func CreateFiles(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("token")
	path := c.Query("path")

	resp := gh.CreateFiles(user, repo, token, path)
	c.IndentedJSON(http.StatusOK, resp)
}

func GetFileContent(c *gin.Context) {
	user := c.Query("username")
	repo := c.Query("repo")
	token := c.GetHeader("token")
	path := c.Query("path")

	resp, _ := gh.FileContent(user, repo, token, path)

	c.IndentedJSON(http.StatusOK, resp)

}
