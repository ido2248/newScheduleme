import Link from "next/link";
import Card from "@/components/ui/Card";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
          <Link
            href="/"
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors text-muted hover:text-foreground text-center"
          >
            תלמיד
          </Link>
          <button
            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-primary text-white shadow-sm"
          >
            מורה
          </button>
        </div>

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
      </Card>
    </div>
  );
}
