import type { Metadata } from 'next';
import Navbar from "../components/navbar";
import '~/app/globals.css';
import { Providers } from '~/app/providers';

// 🎅 SEO & Farcaster Metadata
export const metadata: Metadata = {
  title: "Santa Protocol",
  description: "The gifting layer for Farcaster on Base.",
  openGraph: {
    title: "Santa Protocol",
    description: "Gift $DEGEN to your mutuals this Christmas.",
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://santa-protocol.vercel.app/og-image.png",
      button: {
        title: "Launch Santa",
        action: {
          type: "launch_mini_app",
          name: "Santa Protocol",
          url: "https://santa-protocol.vercel.app",
          appearance: "compact",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#034F1B] antialiased text-white">
        {/* 🎅 FIX: session prop removed from Providers */}
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24 pb-20 px-4 max-w-xl mx-auto w-full">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}