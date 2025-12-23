"use client";

import { sdk } from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";
import UserWorkshop from "../components/UserWorkshop";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const ctx = await sdk.context;
      setContext(ctx);
      setIsReady(true);
      sdk.actions.ready(); // Essential for v2 SDK
    };
    init();
  }, []);

  if (!isReady) return <div className="bg-[#034F1B] min-h-screen" />;

  // We send the user to the Workshop.
  // The Workshop will decide whether to show the Admin tab or not.
  return <UserWorkshop user={context?.user} />;
}