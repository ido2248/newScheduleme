import Link from "next/link";
import Card from "@/components/ui/Card";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">יצירת חשבון מורה</h1>
          <p className="mt-1 text-sm text-muted">
            הירשם כדי להתחיל לתזמן שיעורים
          </p>
        </div>
        <RegisterForm />
        <p className="mt-4 text-center text-sm text-muted">
          יש לך חשבון?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            התחברות
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
