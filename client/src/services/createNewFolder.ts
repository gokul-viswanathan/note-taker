import getBaseURL from '@/utils/baseURL';

export const createNewFolder = async (path: string) => {

    const username = localStorage.getItem("username") || process.env.NEXT_PUBLIC_USER;
    const repo = localStorage.getItem("repo") || process.env.NEXT_PUBLIC_REPO;
    const token = localStorage.getItem("token") || process.env.NEXT_PUBLIC_TOKEN;
    const baseURL = getBaseURL();
    const subpath = path.split("/").map(encodeURIComponent).join("/");

    const url = `${baseURL}/v1/folder?username=${username}&repo=${repo}&path=${subpath}`;
    console.log("Creating folder at URL:", url);
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
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

