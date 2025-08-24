import getBaseURL from '@/utils/baseURL';

const fetchFileContent = async (path: string) => {

    const username = localStorage.getItem("username") || process.env.NEXT_PUBLIC_USER;
    const repo = localStorage.getItem("repo") || process.env.NEXT_PUBLIC_REPO;
    const token = localStorage.getItem("token") || process.env.NEXT_PUBLIC_TOKEN;
    const baseURL = getBaseURL();

    const subpath = path.split("/").map(encodeURIComponent).join("/");
    const url = `${baseURL}/v1/filecontent?username=${username}&repo=${repo}&subpath=${subpath}`;

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

export default fetchFileContent;
