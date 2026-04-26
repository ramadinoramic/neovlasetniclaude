import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Neovlašteni fitness instruktor",
  description:
    "Anti-anksiozna fitness aplikacija. Bez pritiska, bez bildanja egoa.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr" className="dark">
      <body className="bg-charcoal-deep text-ash-50 font-sans">
        <main className="mx-auto flex min-h-screen max-w-screen-sm flex-col px-5 pb-24 pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
