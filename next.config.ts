import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore optional TypeORM dependencies
      config.externals = [...(config.externals || []), {
        'react-native-sqlite-storage': 'react-native-sqlite-storage',
        '@sap/hana-client': '@sap/hana-client',
        'hdb-pool': 'hdb-pool',
        'mysql': 'mysql',
        'mysql2': 'mysql2',
        'oracledb': 'oracledb',
        'pg-native': 'pg-native',
        'pg-query-stream': 'pg-query-stream',
        'redis': 'redis',
        'ioredis': 'ioredis',
        'better-sqlite3': 'commonjs better-sqlite3',
        'sqlite3': 'commonjs sqlite3',
        'sql.js': 'sql.js',
        'mssql': 'mssql',
        'mongodb': 'mongodb',
      }];
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
