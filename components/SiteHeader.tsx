"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Moon, Sun, X, Zap } from "lucide-react"
import { useTheme } from "next-themes"

const NAV_LINKS = [
  { href: "/", label: "Calculator" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => setMounted(true), [])

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isDark = mounted ? resolvedTheme === "dark" : true

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Desktop header (md+) */}
      <header className="sticky top-0 z-40 hidden w-full border-b border-border/60 bg-background/70 backdrop-blur-md md:block">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground hover:text-foreground/80"
          >
            <Zap
              aria-hidden="true"
              className="h-4 w-4 fill-cyan-500 dark:fill-cyan-400 text-cyan-500 dark:text-cyan-400 transition-transform group-hover:scale-110"
            />
            <span>What's The Charge</span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 transition-colors hover:bg-accent ${
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              suppressHydrationWarning
            >
              {mounted && isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile hamburger trigger (< md) */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-accent md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-l border-border bg-background p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight text-foreground"
              >
                <Zap
                  aria-hidden="true"
                  className="h-4 w-4 fill-cyan-500 dark:fill-cyan-400 text-cyan-500 dark:text-cyan-400"
                />
                <span>What's The Charge</span>
              </Link>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1 text-base">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-foreground transition-colors hover:bg-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-border pt-4">
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                suppressHydrationWarning
              >
                <span>{isDark ? "Light mode" : "Dark mode"}</span>
                {mounted && isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
