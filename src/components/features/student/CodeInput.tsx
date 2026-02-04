"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CodeInput() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (trimmed) {
      router.push(`/calendar/${trimmed}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="הזן קוד לוח"
        required
      />
      <Button type="submit" className="w-full">צפה בלוח</Button>
    </form>
  );
}
