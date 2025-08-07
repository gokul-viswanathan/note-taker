// src/pages/Callback.tsx
"use client"
import { useEffect, useState } from "react";

const Callback = () => {
    const [status, setStatus] = useState<string>("Authorizing with GitHub...");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
            setStatus(`Error: ${error}`);
            return;
        }

        if (!code) {
            setStatus("Missing authorization code.");
            return;
        }

        // POST the code to your backend
        const backendURL = "http://localhost:8080"
        fetch(`${backendURL}/api/v1/oauth/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        })
            .then((res) => {
                if (res.ok) {
                    setStatus("Authorization successful! Redirecting...");
                    // redirect to dashboard after a brief delay
                    console.log("the access token for the current user is ", res.body)
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                } else {
                    setStatus("Error completing authorization. Please try again.");
                }
            })
            .catch(() => setStatus("Network error. Please try again later."));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">GitHub OAuth Callback</h1>
            <p className="text-lg text-center">{status}</p>
            {/* optionally add a spinner */}
            <div className="animate-spin mt-4 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
    );
};

export default Callback;

