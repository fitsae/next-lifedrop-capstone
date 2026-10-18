/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  output: "export", // Enables static HTML export
  basePath: "/your-repo-name", // Replace with your exact GitHub repository name
  assetPrefix: "/your-repo-name/", // Must match basePath with a trailing slash
  images: {
    unoptimized: true, // Required because GitHub Pages can't run Next.js image optimization
  },
};

export default nextConfig;
