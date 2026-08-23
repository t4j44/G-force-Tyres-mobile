/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // three.js ships untranspiled ESM in places; keep it in the server bundle
  transpilePackages: ['three'],
};

export default nextConfig;
