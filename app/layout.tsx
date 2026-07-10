import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ステージ泊｜2.5次元観劇遠征ホテルガイド",
  description: "2.5次元ミュージカル・舞台の観劇遠征向けに、劇場までの移動、終演後の戻りやすさ、荷物預かり、料金帯を比較できます。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}