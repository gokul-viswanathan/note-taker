// Package aiservices are used for different LLM calls
package aiservices

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"google.golang.org/genai"
)

func AiCall(data string, prompt string) string {

	fmt.Println("the input prompt is ", data, prompt)

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  os.Getenv("GEMINI_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		fmt.Println(err)
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash",
		genai.Text(data+prompt),
		nil,
	)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println("the result is ", result.Text())

	return result.Text()
}

func OpenAiCall(data string, prompt string) string {
	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		return "OPENAI_API_KEY not set"
	}

	url := "https://api.openai.com/v1/chat/completions"
	payload := map[string]interface{}{
		"model": "gpt-4.1",
		"messages": []map[string]string{
			{"role": "user", "content": data + prompt},
		},
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err.Error()
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err.Error()
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err.Error()
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err.Error()
	}

	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return err.Error()
	}

	if choices, ok := response["choices"].([]interface{}); ok && len(choices) > 0 {
		if choice, ok := choices[0].(map[string]interface{}); ok {
			if message, ok := choice["message"].(map[string]interface{}); ok {
				if content, ok := message["content"].(string); ok {
					return content
				}
			}
		}
	}

	return "Error parsing response"
}
