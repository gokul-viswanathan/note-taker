package aiServices

import (
	"context"
	"fmt"
	"log"

	"google.golang.org/genai"
)

func AiCall(data string, prompt string) string {

	fmt.Println("the input prompt is ", data, prompt)

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  "AIzaSyBFQHB-gk1fzczz1iRMypRQNwd-7FXpZLg",
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		log.Fatal(err)
	}

	result, err := client.Models.GenerateContent(
		ctx,
		"gemini-2.0-flash",
		genai.Text(data+prompt),
		nil,
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("the result is ", result.Text())

	return result.Text()
}
