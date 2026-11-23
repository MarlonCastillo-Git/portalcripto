import { writeFileSync } from "node:fs";

// Only these public Supabase settings belong in the SSR deployment artifacts.
const names = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
for (const name of names) {
  if (!process.env[name]?.trim()) throw new Error(`Missing Amplify environment variable: ${name}`);
}
const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
if (url.protocol !== "https:") throw new Error("Supabase URL must use HTTPS in Amplify");
if (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.startsWith("sb_secret_")) {
  throw new Error("Use a Supabase publishable key, never a secret key");
}
writeFileSync(".env.production", names.map(name => `${name}=${JSON.stringify(process.env[name])}`).join("\n") + "\n", { mode: 0o600 });
console.log("Public Supabase environment prepared for Amplify (values hidden)");
