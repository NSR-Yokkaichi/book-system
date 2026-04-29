import type { MetadataRoute } from "next";
import { CampusConfig } from "@/class/Campus";

/**
 * @summary Web App Manifestの定義
 * @description Web App Manifestの定義を行う。これにより、PWAとして動作することができる。
 * @type {Object}
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const campusName = await CampusConfig.getByKey("name");
  return {
    theme_color: "#8c7851",
    background_color: "#f9f9ef",
    orientation: "any",
    display: "standalone",
    dir: "auto",
    lang: "ja",
    name: `${campusName?.value} 図書管理システム`,
    short_name: `${campusName?.value}図書管理アプリ`,
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
