package github_action

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gokul-viswanathan/note-taker/server/utils"
)

func FileContent(owner string, repo string, token string, path string) (string, error) {

	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/contents/%s", owner, repo, path)

	fmt.Println("the url is", url)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "token "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		log.Fatal("Error in get file contents ", err)
	}

	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	//content - get this
	var contents utils.GithubFileContent
	json.Unmarshal(body, &contents)

	// decode to original string
	cleanContent := []byte(contents.Content)
	cleanContent = bytes.ReplaceAll(cleanContent, []byte("\n"), []byte(""))

	decoded, err := base64.StdEncoding.DecodeString(string(cleanContent))
	if err != nil {
		panic(err)
	}

	return string(decoded), nil
}
