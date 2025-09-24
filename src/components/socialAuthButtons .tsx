"use client";

import { authClient } from "~/lib/auth-client";
import {Code } from "lucide-react";

export function SocialAuthButtons() {
  const handleGithubSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } catch (err) {
      console.error("GitHub login failed:", err);
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleGithubSignIn}
        className="w-full flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <Code className="h-5 w-5" />
        Continue with GitHub
      </button>
    </div>
  );
}
