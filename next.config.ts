import type { NextConfig } from 'next';

// Static export: the whole site is prebuilt HTML, so it can be hosted on
// Vercel, Netlify or any static host. Images are pre-optimised to WebP by
// `npm run images` (see scripts/optimize-images.mjs), not at request time.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
