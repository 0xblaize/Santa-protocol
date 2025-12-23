import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// 🎅 Setup the API Key from your .env
const apiKey = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";

const config = new Configuration({
  apiKey: apiKey,
});

// This is the core client
export const neynarClient = new NeynarAPIClient(config);

/**
 * ✅ FIX: This function is required by your Auth and Signer routes.
 * It simply returns the client instance they are looking for.
 */
export const getNeynarClient = () => neynarClient;

/**
 * ✅ FIX: Used by OpenGraph and Profile lookups
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
 * 🎄 XMAS GIFTING LOGIC: Fetches the "Nice List"
 */
export async function getXmasGiftingList(fid: number) {
  if (!fid) return [];

  try {
    // Cast to 'any' ensures compatibility across different SDK v2 versions
    const response = await (neynarClient as any).fetchUserInteractions({
      fids: fid.toString(),
    });

    const users = response.result?.users || response.users || [];

    // Return users who have at least one verified wallet
    return users.filter((user: any) => 
      (user.verifications && user.verifications.length > 0) || 
      (user.verified_addresses?.eth_addresses && user.verified_addresses.eth_addresses.length > 0)
    );
  } catch (error) {
    console.error("Neynar Engine Error:", error);
    return [];
  }
}