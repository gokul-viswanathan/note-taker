const getBaseUrl = (): string => {
    if (process.env.NEXT_PUBLIC_ENV_NAME === 'development') {
        const url: string = process.env.NEXT_PUBLIC_API_URL || ""; // or whichever port your dev server runs on
        return url;
    } else {
        return 'https://your-production-server.com'; // replace with your prod URL
    }
};

export default getBaseUrl;
