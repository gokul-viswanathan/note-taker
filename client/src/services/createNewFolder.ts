import getBaseURL from "@/utils/baseURL";
import { getGithubConfig } from "@/utils/storage";

export const createNewFolder = async (path: string) => {
  const baseURL = getBaseURL();
  const githubConfig = getGithubConfig();
  if (!githubConfig?.username || !githubConfig?.repo || !githubConfig?.token) {
    throw new Error("Missing GitHub configuration");
  }
  const { username, repo, token } = githubConfig;

  const subpath = path.split("/").map(encodeURIComponent).join("/");

  const url = `${baseURL}/v1/folder?username=${username}&repo=${repo}&path=${subpath}`;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to update new files:", error);
  }
};
