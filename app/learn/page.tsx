import { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: "Learn \u2014 Real EV Charging Guides & Tests | What's The Charge",
  description:
    'Learn how EV charging actually works. Real-world guides on home charging cost, charging speed, Level 2 chargers, and time-of-use rates \u2014 backed by numbers from real EVs.',
  alternates: { canonical: 'https://whatsthecharge.com/learn' },
  openGraph: {
    title: "Learn \u2014 What's The Charge",
    description:
      'Real-world guides on EV charging cost, speed, and setup.',
    url: 'https://whatsthecharge.com/learn',
    type: 'website',
  },
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

export default function LearnIndex() {
  const posts = getAllBlogPosts()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-500">
          Learn
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How EV charging actually works
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Real-world guides on home charging cost, speed, and setup.
          Real vehicles, real bills, no sponsored fluff.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No notes yet. Check back soon.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/learn/${post.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-cyan-500/50 hover:bg-card/70"
              >
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-500">
                  <span aria-hidden="true">{post.categoryIcon}</span>
                  <span>{post.category}</span>
                </div>

                <h2 className="text-lg font-semibold leading-snug text-foreground group-hover:text-foreground sm:text-xl">
                  {post.title}
                </h2>

                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground sm:text-base">
                  {post.description}
                </p>

                <div className="mt-auto pt-6">
                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span>{post.readMinutes} min read</span>
                    <span>{formatDate(post.published)}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
