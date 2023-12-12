/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/api/:path*"
            : "/api/",
      },
    ];
  },
};
module.exports = {
  ...nextConfig,
  output: "standalone",
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@tensorflow/tfjs-backend-wasm",
        "node_modules/@tensorflow/tfjs-backend-webgl",
        "node_modules/@tensorflow/tfjs-converter",
        "node_modules/@tensorflow/tfjs-core",
      ],
    },
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    if (isServer) {
      config.externals.push({
        bufferutil: "bufferutil",
        "utf-8-validate": "utf-8-validate",
      });
    }
    return config;
  },
};
