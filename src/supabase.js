import { createClient } from "@supabase/supabase-js";

let supabase;

export function getDiaryImageBucket() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to upload diary photos");
    }

    if (!supabase) {
        const projectUrl = new URL(url);
        if (projectUrl.pathname === "/rest/v1" || projectUrl.pathname === "/rest/v1/") {
            projectUrl.pathname = "/";
        } else if (projectUrl.pathname !== "/") {
            throw new Error("VITE_SUPABASE_URL must be the Supabase Project URL, not a REST endpoint or other path");
        }
        if (projectUrl.search || projectUrl.hash) {
            throw new Error("VITE_SUPABASE_URL must not include a query string or fragment");
        }
        supabase = createClient(projectUrl.origin, anonKey);
    }
    return supabase.storage.from(import.meta.env.VITE_SUPABASE_DIARY_BUCKET || "diary-images");
}
