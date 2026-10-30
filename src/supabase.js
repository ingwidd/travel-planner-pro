import { createClient } from "@supabase/supabase-js";

let supabase;

export function getDiaryImageBucket() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
        throw new Error("Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to upload diary photos");
    }

    if (!supabase) {
        supabase = createClient(url, anonKey);
    }
    return supabase.storage.from(import.meta.env.VITE_SUPABASE_DIARY_BUCKET || "diary-images");
}
