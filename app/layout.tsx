import type { Metadata, Viewport } from "next";
import {
  Architects_Daughter,
  Caveat,
  Dancing_Script,
  Gochi_Hand,
  Kalam,
  Patrick_Hand,
  Shadows_Into_Light
} from "next/font/google";
import "./globals.css";

const caveat = Caveat({ subsets: ["latin"], variable: "--f-caveat", display: "swap" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-kalam", display: "swap" });
const patrick = Patrick_Hand({ subsets: ["latin"], weight: "400", variable: "--f-patrick", display: "swap" });
const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--f-gochi", display: "swap" });
const architects = Architects_Daughter({ subsets: ["latin"], weight: "400", variable: "--f-architects", display: "swap" });
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--f-dancing", display: "swap" });
const shadows = Shadows_Into_Light({ subsets: ["latin"], weight: "400", variable: "--f-shadows", display: "swap" });

// o site vive em /tarefas no GitHub Pages; caminhos de metadata não recebem o basePath sozinhos
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Tarefas",
  description: "As tarefas do dia, numa folha que melhora conforme você cumpre.",
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Tarefas" },
  icons: { apple: `${base}/apple-touch-icon.png` }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#e6e1d3"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = [caveat, kalam, patrick, gochi, architects, dancing, shadows].map((f) => f.variable).join(" ");
  return (
    <html lang="pt-BR" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
