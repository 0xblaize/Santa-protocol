"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";

// 1. Initialize the QueryClient
const queryClient = new QueryClient();

// 2. Create the Wagmi Config specifically for Farcaster Mini Apps
export const config = createConfig({
  chains: [base],
  connectors: [farcasterFrame()], // Connects the wallet inside Warpcast
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}