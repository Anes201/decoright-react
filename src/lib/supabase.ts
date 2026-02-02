
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../types/database.types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment");
}


const MAX_REQUESTS = 100;
const WINDOW_MS = 60000; // 1 minute
let requestHistory: number[] = [];

const rateLimitedFetch: typeof fetch = async (input, init) => {
  const now = Date.now();
  requestHistory = requestHistory.filter(timestamp => now - timestamp < WINDOW_MS);

  if (requestHistory.length >= MAX_REQUESTS) {
    const errorMsg = `Supabase request blocked by rate limiter (${MAX_REQUESTS} reqs/min exceeded). Possible loop detected.`;
    console.error(errorMsg, { url: input });
    throw new Error(errorMsg);
  }

  requestHistory.push(now);
  return fetch(input, init);
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: rateLimitedFetch
  }
});
