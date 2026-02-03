"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("אימייל או סיסמה שגויים.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("משהו השתבש. נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-danger">
          {error}
        </div>
      )}
      <Input
        label="אימייל"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="teacher@school.com"
        required
      />
      <Input
        label="סיסמה"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="הזן סיסמה"
        required
        minLength={6}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "מתחבר..." : "התחברות"}
      </Button>
    </form>
  );
}
