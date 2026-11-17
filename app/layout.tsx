import type { Metadata, Viewport } from "next";
import "./first-build.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bijindevuwedding.online"),
  title: "Bijin & Devu — The Wedding Celebration",
  description: "Auspiciously invited to celebrate the wedding of Bijin and Devu.",
  openGraph: {
    title: "Bijin & Devu — The Wedding Celebration",
    description: "Join Bijin and Devu as they celebrate their wedding on 07 February 2027.",
    type: "website",
    images: [{ url: "/dreamy-watercolour-couple-portrait.png", width: 1086, height: 1448, alt: "Bijin and Devu, celebrating their wedding" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bijin & Devu — The Wedding Celebration",
    description: "Join Bijin and Devu as they celebrate their wedding on 07 February 2027.",
    images: ["/dreamy-watercolour-couple-portrait.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="scroll-smooth"><body>{children}</body></html>;
}
