import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

/**
 * 🎅 Environment Variable Setup
 * On Vercel, this will pull from the settings you just added.
 */
const apiKey = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";

const config = new Configuration({
  apiKey: apiKey,
});

// Primary client instance
export const neynarClient = new NeynarAPIClient(config);

/**
 * ✅ FIX FOR AUTH ERROR: 
 * This creates the missing link for your Auth and Signer routes.
 */
export const getNeynarClient = () => neynarClient;

/**
 * ✅ FIX FOR OG-IMAGE ERROR: 
 * Fetches a single user's profile data.
 */
export async function getNeynarUser(fid: number) {
  if (!fid) return null;
  try {
    const response = await neynarClient.fetchBulkUsers({ fids: [Number(fid)] });
    return response.users[0] || null;
  } catch (error) {
    console.error("Error fetching single user:", error);
    return null;
  }
}

/**
 * 🎄 XMAS GIFTING LOGIC: 
 * Fetches users who have interacted with the target FID.
 */
export async function getXmasGiftingList(fid: number) {
  if (!fid) return [];

  try {
    // Cast to 'any' to handle varying SDK method signatures across versions
    const response = await (neynarClient as any).fetchUserInteractions({
      fids: fid.toString(),
    });

    // Extract users from the nested response structure (V2)
    const users = response.result?.users || response.users || [];

    // Filter for users who have a verified wallet connected to Farcaster
    return users.filter((user: any) => 
      (user.verifications && user.verifications.length > 0) || 
      (user.verified_addresses?.eth_addresses && user.verified_addresses.eth_addresses.length > 0)
    );
  } catch (error) {
    console.error("Xmas Gifting List Engine Error:", error);
    return [];
  }
}