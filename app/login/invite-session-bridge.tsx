"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient, hasSupabaseBrowserConfig } from "@/lib/supabase/browser";

function redirectWithoutHash(path: string) {
  window.location.replace(path);
}

export function InviteSessionBridge() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const type = hash.get("type");

    if (!accessToken || !refreshToken) {
      return;
    }

    setStatus("Verifying private access link...");

    if (!hasSupabaseBrowserConfig()) {
      redirectWithoutHash("/login?error=config");
      return;
    }

    const supabase = createSupabaseBrowserClient();

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      .then(({ error }) => {
        if (error) {
          redirectWithoutHash(`/login?error=${encodeURIComponent("Unable to verify private access link.")}`);
          return;
        }

        redirectWithoutHash(type === "invite" || type === "recovery" ? "/set-password" : "/dashboard");
      })
      .catch(() => {
        redirectWithoutHash(`/login?error=${encodeURIComponent("Unable to verify private access link.")}`);
      });
  }, []);

  if (!status) {
    return null;
  }

  return <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{status}</p>;
}
