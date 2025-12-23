"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { ReactNode, useState } from "react";

// 1. Initialize the Wagmi Config
export const config = createConfig({
  chains: [base],
  connectors: [farcasterFrame()], 
  transports: {
    [base.id]: http(),
  },
});

// 2. Define the Props Interface (Adding session fixes the build error)
interface ProvidersProps {
  children: ReactNode;
  session?: any; // 🎅 This line stops the "session does not exist" error
}

export function Providers({ children }: ProvidersProps) {
  // 3. Create QueryClient inside useState to ensure it stays stable across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}