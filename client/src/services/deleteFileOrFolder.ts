import { FileItem } from "@/types/git-interface";
import getBaseURL from "@/utils/baseURL";
import { getGithubConfig } from "@/utils/storage";

export const deleteFileOrFolder = async (file: FileItem) => {
  const baseURL = getBaseURL();
  const githubConfig = getGithubConfig();
  if (!githubConfig?.username || !githubConfig?.repo || !githubConfig?.token) {
    throw new Error("Missing GitHub configuration");
  }
  const { username, repo, token } = githubConfig;
  const path = file.path.split("/").map(encodeURIComponent).join("/");

  let url = "";
  if (file.type == "file") {
    url = `${baseURL}/v1/deleteFile?username=${username}&repo=${repo}&path=${path}&sha=${file?.sha}`;
  } else {
    url = `${baseURL}/v1/deleteFolder?username=${username}&repo=${repo}&path=${path}`;
  }
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};
