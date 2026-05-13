import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80"
        >
          What's The Charge
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/blog"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
