"use client"
import React from 'react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import LandingPage from '@/components/landingPage/LandingPage';

const ThoughtInkLanding = () => {
    return (
        <ThemeProvider>
            <LandingPage />
        </ThemeProvider>
    );
};

export default ThoughtInkLanding;
