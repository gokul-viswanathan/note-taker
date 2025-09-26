
import getBaseURL from '@/utils/baseURL';
import { FileItem } from '@/types/git-interface'

const updateFileContent = async (currentFile: FileItem, content: any) => {

    const username = localStorage.getItem("username") || process.env.NEXT_PUBLIC_USER;
    const repo = localStorage.getItem("repo") || process.env.NEXT_PUBLIC_REPO;
    const token = localStorage.getItem("token") || process.env.NEXT_PUBLIC_TOKEN;
    const baseURL = getBaseURL();

    const subpath = currentFile.path.split("/").map(encodeURIComponent).join("/");
    const url = `${baseURL}/v1/filecontent?username=${username}&repo=${repo}&path=${subpath}`;
    console.log("Updateing file content to URL:", url);

    const requestBody = {
        content: content,
        sha: currentFile.sha || "",
        commitMessage: currentFile.sha ? `Update ${currentFile.path} via Quill Editor` : 'Create file at path ${currentFile.path}'
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        console.log(`File ${currentFile.path} updated successfully.`);

    } catch (error) {
        console.error("Failed to fetch files:", error);
    }
};

export default updateFileContent;
