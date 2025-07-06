import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Faz com que o Next confie neste domínio para exibir as imagens que estão hospedadas nele
  images: {
    remotePatterns: [{ hostname: "u9a6wmr3as.ufs.sh" }],
  },
};

export default nextConfig;
