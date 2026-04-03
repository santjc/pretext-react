import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Header />
        <Navigation />
        <main className="mt-10 sm:mt-12">{children}</main>
      </div>
    </div>
  )
}
