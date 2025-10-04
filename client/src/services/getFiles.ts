import getBaseURL from '@/utils/baseURL';
import { getGithubConfig } from '@/utils/storage';

const fetchFiles = async (path: string) => {

    const baseURL = getBaseURL();
    const githubConfig = getGithubConfig();
    if (!githubConfig?.username || !githubConfig?.repo || !githubConfig?.token) {
        throw new Error('Missing GitHub configuration');
    }
    const { username, repo, token } = githubConfig;

    const subpath = path.split("/").map(encodeURIComponent).join("/");
    const url = `${baseURL}/v1/files?username=${username}&repo=${repo}&subpath=${subpath}`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch files:", error);
    }
};

export default fetchFiles;
