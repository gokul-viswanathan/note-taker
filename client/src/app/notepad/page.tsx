'use client'
import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import EditorPage from "@/components/editor/EditorPage"
import GithubAuthPage from "@/components/oauth/OAuthPage"
import { Skeleton } from "@/components/ui/skeleton"

const NotePadPage = () => {
    const [authState, setAuthState] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'

    useEffect(() => {
        const githubAuth = localStorage.getItem('user_github_data');
        if (githubAuth) {
            setAuthState('authenticated');
        } else {
            setAuthState('unauthenticated');
        }
    }, []);

    if (authState === 'checking') {
        return <Skeleton className="h-4 w-4 rounded-full" />;
    }

    return (
        <ThemeProvider>
            {authState === 'authenticated' ? (
                <EditorPage />
            ) : (
                <GithubAuthPage />
            )}
        </ThemeProvider>
    );
};

export default NotePadPage;

