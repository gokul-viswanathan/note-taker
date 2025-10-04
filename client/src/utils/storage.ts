export interface GithubConfig {
    username: string;
    repo: string;
    token: string;
}

const STORAGE_KEY = 'user_github_data';

export const getGithubConfig = (): GithubConfig | null => {
    if (typeof window === 'undefined') return null; // SSR safety

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
        const parsed = JSON.parse(stored);

        // Runtime validation
        if (
            typeof parsed.username === 'string' &&
            typeof parsed.repo === 'string' &&
            typeof parsed.token === 'string'
        ) {
            return parsed as GithubConfig;
        }

        console.error('Invalid github config structure');
        return null;
    } catch (error) {
        console.error('Failed to parse github config:', error);
        return null;
    }
};
