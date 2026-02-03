import Link from "next/link";
import { auth } from "@/lib/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CodeInput from "@/components/features/student/CodeInput";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        {/* Student Section */}
        <Card className="flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-xl font-bold">תלמיד</h2>
            <p className="mt-1 text-sm text-muted">
              הזן את קוד הלוח של המורה שלך כדי לצפות בשיעורים הזמינים ולהזמין מקום.
            </p>
          </div>
          <CodeInput />
        </Card>

        {/* Teacher Section */}
        <Card className="flex flex-col justify-center">
          <div className="mb-4">
            <h2 className="text-xl font-bold">מורה</h2>
            <p className="mt-1 text-sm text-muted">
              צור ונהל לוחות זמנים לשיעורים פרטיים.
            </p>
          </div>
          {session ? (
            <Link href="/dashboard">
              <Button className="w-full">למרכז הבקרה</Button>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href="/login">
                <Button className="w-full">התחברות</Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" className="w-full">
                  יצירת חשבון
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
