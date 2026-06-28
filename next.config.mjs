/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a minimal standalone server bundle so the Docker image stays small.
  output: "standalone",
  reactStrictMode: true,
};

export default nextConfig;
