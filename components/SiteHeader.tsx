"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const [open, setOpen] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

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

  // Prevent body scroll when open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const isDark = mounted ? resolvedTheme === "dark" : true

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="fixed right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-sm backdrop-blur-md transition-colors hover:bg-accent"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
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
                className="text-sm font-semibold tracking-tight text-foreground"
              >
                What's The Charge
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
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-foreground transition-colors hover:bg-accent"
              >
                Calculator
              </Link>
              <Link
                href="/learn"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-foreground transition-colors hover:bg-accent"
              >
                Learn
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-foreground transition-colors hover:bg-accent"
              >
                About
              </Link>
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
