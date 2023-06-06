/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer || true) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls:false,
            "react-native":false,
            //"ethers/lib/utils":require.resolve("ethers/lib/utils")
        };

    }

    return config;
  },
  //transpilePackages:["@pancakeswap/smart-router/evm", "ethers/lib/utils"]
}

module.exports = nextConfig
