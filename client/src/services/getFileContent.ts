import getBaseURL from "@/utils/baseURL";
import { getGithubConfig } from "@/utils/storage";

const fetchFileContent = async (path: string) => {
  const baseURL = getBaseURL();
  const githubConfig = getGithubConfig();
  if (!githubConfig?.username || !githubConfig?.repo || !githubConfig?.token) {
    throw new Error("Missing GitHub configuration");
  }
  const { username, repo, token } = githubConfig;
  const subpath = path.split("/").map(encodeURIComponent).join("/");
  const url = `${baseURL}/v1/filecontent?username=${username}&repo=${repo}&subpath=${subpath}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle specific HTTP status codes
    if (!response.ok) {
      if (response.status === 404) {
        console.warn("File not found (may have been deleted)");
        return null; // or return { error: 'not_found' }
      }

      if (response.status === 403) {
        console.error("Access forbidden to file");
        return null;
      }

      if (response.status === 401) {
        console.error("Unauthorized - token may be invalid");
        return null;
      }

      if (response.status === 502) {
        console.error("Unauthorized - token may be invalid");
        return null;
      }

      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch file:", error);
    return null; // Return null instead of throwing to allow graceful handling
  }
};

export default fetchFileContent;
