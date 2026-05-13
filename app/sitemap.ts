import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const blogEntries: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `https://whatsthecharge.com/blog/${post.slug}`,
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
      url: 'https://whatsthecharge.com/blog',
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...blogEntries,
  ]
}
