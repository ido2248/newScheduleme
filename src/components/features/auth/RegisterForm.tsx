"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerUser } from "@/app/(auth)/register/actions";

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן תואמות.");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
      } else {
        router.push("/login?registered=true");
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
        label="שם מלא"
        name="name"
        type="text"
        placeholder="השם המלא שלך"
        required
      />
      <Input
        label="אימייל"
        name="email"
        type="email"
        placeholder="teacher@school.com"
        required
      />
      <Input
        label="סיסמה"
        name="password"
        type="password"
        placeholder="לפחות 6 תווים"
        required
        minLength={6}
      />
      <Input
        label="אימות סיסמה"
        name="confirmPassword"
        type="password"
        placeholder="הזן סיסמה שוב"
        required
        minLength={6}
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "יוצר חשבון..." : "יצירת חשבון"}
      </Button>
    </form>
  );
}
