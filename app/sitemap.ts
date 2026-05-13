import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const fieldNoteEntries: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `https://whatsthecharge.com/learn/${post.slug}`,
    lastModified: post.updated ? new Date(post.updated) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://whatsthecharge.com',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://whatsthecharge.com/learn',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...fieldNoteEntries,
  ]
}
