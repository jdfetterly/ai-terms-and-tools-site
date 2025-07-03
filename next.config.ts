import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  ...(process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  webpack: (config, { isServer }) => {
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      // Exclude server actions and AI-related modules for static export
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/app/actions': false,
        '@/ai/flows/generate-ai-example': false,
        '@/ai/genkit': false,
      };
    }
    return config;
  },
};

export default nextConfig;
