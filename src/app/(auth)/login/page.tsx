import Link from "next/link";
import Card from "@/components/ui/Card";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">התחברות מורה</h1>
          <p className="mt-1 text-sm text-muted">
            התחבר לניהול הלוחות שלך
          </p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted">
          אין לך חשבון?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            צור חשבון
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          <Link href="/" className="font-medium text-primary hover:underline">
            חזרה לדף הבית
          </Link>
        </p>
      </Card>
    </div>
  );
}
