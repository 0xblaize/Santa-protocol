import type { Metadata } from 'next';
import Navbar from "../components/navbar";
import '~/app/globals.css';
import { Providers } from '~/app/providers';
import { APP_NAME, APP_DESCRIPTION } from '~/lib/constants';

// 1. SEO & Farcaster Metadata
export const metadata: Metadata = {
  title: "Santa Protocol",
  description: "The gifting layer for Farcaster on Base.",
  openGraph: {
    title: "Santa Protocol",
    description: "Gift $DEGEN to your mutuals this Christmas.",
  },
  // This is required for your app to show up correctly in Warpcast
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://your-app.vercel.app/og-image.png",
      button: {
        title: "Launch Santa",
        action: {
          type: "launch_mini_app",
          name: "Santa Protocol",
          url: "https://your-app.vercel.app",
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
      <body className="bg-[#034F1B] antialiased">
        {/* 2. Providers wraps everything. 
          This fix ensures 'useAccount' works in TippingTab. 
        */}
        <Providers>
          <div className="flex flex-col min-h-screen">
            
            {/* 3. The Header (Project Name Left, PFP Right) */}
            <Navbar />

            {/* 4. Main Content Area 
              pt-24 provides space so content isn't hidden by the fixed Navbar.
              pb-20 provides space for the bottom tab navigation if you have one.
            */}
            <main className="flex-grow pt-24 pb-20 px-4 max-w-xl mx-auto w-full">
              {children}
            </main>

          </div>
        </Providers>
      </body>
    </html>
  );
}