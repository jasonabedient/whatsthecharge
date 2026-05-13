import { Metadata } from 'next'
import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'EV Charging Blog — Real Costs, Real Numbers | What\'s The Charge',
  description:
    'Practical guides on EV home charging cost, charging speed, Level 2 chargers, and time-of-use rates — built around the What\'s The Charge calculator.',
  alternates: { canonical: 'https://whatsthecharge.com/blog' },
  openGraph: {
    title: 'EV Charging Blog — What\'s The Charge',
    description:
      'Practical guides on EV charging cost, speed, and setup.',
    url: 'https://whatsthecharge.com/blog',
    type: 'website',
  },
}

function formatDate(d: string) {
  if (!d) return ''
  const date = new Date(d)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BlogIndex() {
  const posts = getAllBlogPosts()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          ← Back to calculator
        </Link>
      </nav>

      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">EV Charging Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Real numbers from real EVs. No sponsored fluff.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <ul className="space-y-8">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="border-b border-border pb-8 last:border-0"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <time className="text-xs uppercase tracking-wide text-muted-foreground">
                  {formatDate(post.published)}
                </time>
                <h2 className="mt-2 text-2xl font-semibold group-hover:underline">
                  {post.title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {post.description}
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-foreground group-hover:underline">
                  Read post →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
