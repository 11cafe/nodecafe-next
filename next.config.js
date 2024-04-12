/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comfyspace.s3.us-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ["@mdxeditor/editor"],
  // webpack: (config) => {
  //   return {
  //     ...config,
  //     module: {
  //       rules: [
  //         {
  //           test: /\.tsx?$/,
  //           use: "ts-loader",
  //           exclude: /node_modules/,
  //         },
  //       ],
  //     },
  //     resolve: {
  //       extensions: [".tsx", ".ts", ".js"],
  //     },
  //   };
  // },
};

module.exports = nextConfig;
