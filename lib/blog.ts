import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  keywords?: string
  published: string
  updated?: string
  youtubeId?: string
  hero?: string
  author?: string
  category?: string
  categoryIcon?: string
  readMinutes?: number
}

export type BlogPost = BlogPostMeta & {
  content: string
}

function readAll(): { filename: string; data: any; content: string }[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((filename) => {
      const file = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(file)
      return { filename, data, content }
    })
}

export function getAllBlogPosts(): BlogPostMeta[] {
  return readAll()
    .map(({ filename, data }) => ({
      slug: data.slug || filename.replace(/\.(md|mdx)$/, ''),
      title: data.title || '',
      description: data.description || '',
      keywords: data.keywords || '',
      published: data.published || '',
      updated: data.updated || data.published || '',
      youtubeId: data.youtubeId || '',
      hero: data.hero || '',
      author: data.author || "Jason at What's The Charge",
      category: data.category || 'GUIDE',
      categoryIcon: data.categoryIcon || '⚡',
      readMinutes: data.readMinutes || estimateReadMinutes(readAllRaw(data.slug || filename)),
    }))
    .sort((a, b) => (a.published < b.published ? 1 : -1))
}

function estimateReadMinutes(content: string): number {
  if (!content) return 5
  const words = content.trim().split(/\s+/).length
  return Math.max(3, Math.round(words / 220))
}

function readAllRaw(slugOrFilename: string): string {
  try {
    const all = readAll()
    const match = all.find(
      ({ filename, data }) =>
        data.slug === slugOrFilename ||
        filename.replace(/\.(md|mdx)$/, '') === slugOrFilename ||
        filename === slugOrFilename,
    )
    return match?.content || ''
  } catch {
    return ''
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const all = readAll()
  const match = all.find(
    ({ filename, data }) =>
      data.slug === slug || filename.replace(/\.(md|mdx)$/, '') === slug,
  )
  if (!match) return null
  return {
    slug: match.data.slug || match.filename.replace(/\.(md|mdx)$/, ''),
    title: match.data.title || '',
    description: match.data.description || '',
    keywords: match.data.keywords || '',
    published: match.data.published || '',
    updated: match.data.updated || match.data.published || '',
    youtubeId: match.data.youtubeId || '',
    hero: match.data.hero || '',
    author: match.data.author || "Jason at What's The Charge",
    category: match.data.category || 'GUIDE',
    categoryIcon: match.data.categoryIcon || '⚡',
    readMinutes: match.data.readMinutes || estimateReadMinutes(match.content),
    content: match.content,
  }
}

export function getAllBlogSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug)
}
