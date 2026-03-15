"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/client");
  }

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Please check your email if confirmation is required.");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-brand-charcoal">
          Client Login
        </h1>

        <div className="mt-4 grid gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-xl border border-black/10 px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-xl border border-black/10 px-4 py-3"
          />

          <button
            onClick={handleLogin}
            className="rounded-xl bg-brand-purple px-4 py-3 font-semibold text-white"
          >
            Log In
          </button>

          <button
            onClick={handleSignup}
            className="rounded-xl border border-black/10 px-4 py-3 font-semibold text-brand-charcoal"
          >
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}