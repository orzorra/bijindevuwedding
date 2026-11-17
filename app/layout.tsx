import type { Metadata, Viewport } from "next";
import "./first-build.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bijindevuwedding.online"),
  title: "Bijin & Devu — The Wedding Celebration",
  description: "Auspiciously invited to celebrate the wedding of Bijin and Devu.",
  openGraph: {
    title: "Bijin & Devu — The Wedding Celebration",
    description: "Join Bijin and Devu as they celebrate their wedding on 07 February 2027.",
    url: "https://www.bijindevuwedding.online",
    siteName: "Bijin & Devu Wedding",
    type: "website",
    images: [{ url: "/wedding-share-preview.jpg", width: 1731, height: 909, alt: "Bijin and Devu, celebrating their wedding" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bijin & Devu — The Wedding Celebration",
    description: "Join Bijin and Devu as they celebrate their wedding on 07 February 2027.",
    images: ["/wedding-share-preview.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="scroll-smooth"><body>{children}</body></html>;
}
