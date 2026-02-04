import Header from "@/components/ui/Header";
import HomePageContent from "@/components/features/home/HomePageContent";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex items-start justify-center px-4 py-12">
        <HomePageContent />
      </main>
    </div>
  );
}
