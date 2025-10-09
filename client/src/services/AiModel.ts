export async function apiCall(data: string, prompt: string): Promise<string> {
  const baseUrl = "http://localhost:8080/airesponse";

  const params = {
    context: data,
    question: prompt,
  };

  // Construct query string
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}?${queryString}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text(); // Parse JSON response)
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}
