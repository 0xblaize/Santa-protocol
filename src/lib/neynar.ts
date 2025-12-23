import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// Checks for both potential naming conventions in your .env
const apiKey = process.env.NEYNAR_API_KEY || process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";

const config = new Configuration({
  apiKey: apiKey,
});

export const neynarClient = new NeynarAPIClient(config);

/**
 * 🎅 Fetches a single user profile.
 * FIX: 'fetchBulkUsers' requires an object with { fids: [number] }
 */
export async function getNeynarUser(fid: number) {
  if (!fid) return null;
  try {
    // Note the structure: { fids: [fid] }
    const response = await neynarClient.fetchBulkUsers({ fids: [Number(fid)] });
    return response.users[0] || null;
  } catch (error) {
    console.error("Error fetching Neynar user:", error);
    return null;
  }
}

/**
 * 🎄 Xmas Gifting Logic: Fetches the "Nice List"
 * FIX: Handles the SDK V2 structure for interactions
 */
export async function getXmasGiftingList(fid: number) {
  if (!fid) return [];

  try {
    // Using 'any' to bypass strict SDK type checking which often causes 'fid' errors
    const response = await (neynarClient as any).fetchUserInteractions({
      fids: fid.toString(),
    });

    // Check both potential response paths (SDK version dependent)
    const users = response.result?.users || response.users || [];

    // Filter for users who have a wallet connected (so you can tip them!)
    return users.filter((user: any) => 
      (user.verifications && user.verifications.length > 0) || 
      (user.verified_addresses?.eth_addresses && user.verified_addresses.eth_addresses.length > 0)
    );
  } catch (error) {
    console.error("Neynar Engine Error:", error);
    return [];
  }
}