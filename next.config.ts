import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/bijindevuwedding" : undefined,
  assetPrefix: isGitHubPages ? "/bijindevuwedding/" : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/bijindevuwedding" : "",
  },
};
export default nextConfig;
