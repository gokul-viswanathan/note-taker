'use client'
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import EditorPage from "@/components/editor/EditorPage"

const NotePadPage = () => {
    return (
        <ThemeProvider>
            <EditorPage />
        </ThemeProvider>
    );
};

export default NotePadPage;

