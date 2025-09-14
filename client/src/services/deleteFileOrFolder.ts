import { FileItem } from '@/types/git-interface';
import getBaseURL from '@/utils/baseURL';

export const deleteFileOrFolder = async (file: FileItem) => {

    const username = localStorage.getItem("username") || process.env.NEXT_PUBLIC_USER;
    const repo = localStorage.getItem("repo") || process.env.NEXT_PUBLIC_REPO;
    const token = localStorage.getItem("token") || process.env.NEXT_PUBLIC_TOKEN;
    const baseURL = getBaseURL();
    const path = file.path.split("/").map(encodeURIComponent).join("/");

    // router.DELETE("/api/v1/delete", handlers.DeleteFile)
    // user := c.Query("username")
    // repo := c.Query("repo")
    // path := c.Query("path")
    // sha := c.Query("sha")
    // authHeader := c.GetHeader("Authorization")

    let url = ""
    if (file.type == "file") {
        url = `${baseURL}/v1/deleteFile?username=${username}&repo=${repo}&path=${path}&sha=${file?.sha}`;
    } else {
        url = `${baseURL}/v1/deleteFolder?username=${username}&repo=${repo}&path=${path}`;
    }
    console.log("Deleting file at URL:", url);
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
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
