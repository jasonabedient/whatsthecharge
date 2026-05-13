import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
} from '@/lib/blog'

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  const url = `https://whatsthecharge.com/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.published,
      modifiedTime: post.updated,
      authors: [post.author || ''],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const url = `https://whatsthecharge.com/blog/${post.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: "What's The Charge",
      logo: {
        '@type': 'ImageObject',
        url: 'https://whatsthecharge.com/icon-light-32x32.png',
      },
    },
    datePublished: post.published,
    dateModified: post.updated,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <nav className="mb-8 text-sm">
        <Link
          href="/blog"
          className="text-muted-foreground hover:text-foreground"
        >
          ← All posts
        </Link>
      </nav>

      <header className="mb-8">
        <time className="text-xs uppercase tracking-wide text-muted-foreground">
          {formatDate(post.published)}
        </time>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {post.description}
        </p>
      </header>

      {post.youtubeId && (
        <div className="mb-10 aspect-video w-full overflow-hidden rounded-lg border border-border">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${post.youtubeId}`}
            title={post.title}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <article className="prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-a:underline prose-table:text-sm">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>

      <hr className="my-12 border-border" />

      <section className="rounded-lg border border-border bg-muted/30 p-6">
        <h2 className="text-xl font-semibold">
          Calculate your real charging cost
        </h2>
        <p className="mt-2 text-muted-foreground">
          Plug in your vehicle, charger, and local electricity rate. Get exact
          numbers in seconds.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          Open the EV charging calculator →
        </Link>
      </section>
    </main>
  )
}
