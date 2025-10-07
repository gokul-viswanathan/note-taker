const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID // githuapp client id - need to secure
const REDIRECT_URI = "http://localhost:3000/callback"
const APP_SLUG = "Thought Ink";

export default function githubAuth(): string {

    const scopes = ['repo'];
    const scopeParam = encodeURIComponent(scopes.join(' '));
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopeParam}`;
    console.log(" step 1: the url being called ", githubAuthUrl)
    window.location.href = githubAuthUrl;
    return "Redirecting to Github...";
}

