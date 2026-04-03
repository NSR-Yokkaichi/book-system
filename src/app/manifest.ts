import type { MetadataRoute } from "next";

/**
 * @summary Web App Manifestの定義
 * @description Web App Manifestの定義を行う。これにより、PWAとして動作することができる。
 * @type {Object}
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: "#8c7851",
    background_color: "#f9f9ef",
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ja",
    name: "四日市キャンパス 図書管理システム",
    short_name: "四日市CP図書管理アプリ",
    start_url: process.env.BETTERAUTH_URL!,
    scope: process.env.BETTERAUTH_URL!,
    id: process.env.BETTERAUTH_URL!,
    icons: [
      {
        src: "/icon_192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon_512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
