import type { MetadataRoute } from "next";

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
    start_url: "https://book.unipro-n.com/",
    scope: "https://book.unipro-n.com/",
    id: "https://book.unipro-n.com/",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
