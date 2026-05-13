/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/blog', destination: '/learn', permanent: true },
      { source: '/blog/:slug', destination: '/learn/:slug', permanent: true },
      { source: '/field-notes', destination: '/learn', permanent: true },
      { source: '/field-notes/:slug', destination: '/learn/:slug', permanent: true },
    ]
  },
}

export default nextConfig
