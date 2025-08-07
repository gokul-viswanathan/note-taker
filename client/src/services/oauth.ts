

// const CLIENT_ID = "Ov23liqa1cXmK19LF4gk"; (oauth client id)

const CLIENT_ID = "Iv23liOSDKA05BdSC59m"; // githuapp client id - need to secure
const REDIRECT_URI = "http://localhost:3000/callback"
const APP_SLUG = "Thought Ink";

export default function githubAuth(): string {

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo`;

    window.location.href = githubAuthUrl;
    return "Redirecting to Github...";
}

