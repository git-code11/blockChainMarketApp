/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout:120,
  reactStrictMode: true,
  trailingSlash:true,
  webpack: (config, { isServer }) => {
    if (!isServer || true) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'

        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls:false,
            "react-native":false
        };

    }

    return config;
  },
  //transpilePackages:["@pancakeswap/smart-router/evm", "ethers/lib/utils"]
}

module.exports = nextConfig
