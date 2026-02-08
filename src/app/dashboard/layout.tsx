import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const logoutForm = (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        type="submit"
        className="text-white hover:bg-white/10"
      >
        התנתקות
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        variant="dashboard"
        userName={session.user.name}
        logoutForm={logoutForm}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
