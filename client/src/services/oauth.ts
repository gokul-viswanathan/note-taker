import { callBackUrl } from "@/utils/baseURL";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const REDIRECT_URI = callBackUrl() + "/callback";

export default function githubAuth(): string {
  const scopes = ["repo"];
  const scopeParam = encodeURIComponent(scopes.join(" "));
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopeParam}`;
  window.location.href = githubAuthUrl;
  return "Redirecting to Github...";
}
