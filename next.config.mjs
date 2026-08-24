/** @type {import('next').NextConfig} */
const appEnvironment = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
const mockDataEnabled = process.env.ENABLE_MOCK_DATA === 'true';
const isProduction = process.env.NODE_ENV === 'production' || appEnvironment === 'production';

if (isProduction && mockDataEnabled) {
  throw new Error(
    'Unsafe configuration: ENABLE_MOCK_DATA=true is forbidden when NODE_ENV or APP_ENV is production.',
  );
}

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    authInterrupts: true,
  },
  env: {
    NEXT_PUBLIC_ENABLE_MOCK_DATA: String(mockDataEnabled),
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // three.js ships untranspiled ESM in places; keep it in the server bundle
  transpilePackages: ['three'],
};

export default nextConfig;
