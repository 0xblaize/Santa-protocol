import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_NEYNAR_API_KEY as string || "",
});

export const neynarClient = new NeynarAPIClient(config);

/**
 * Xmas Gifting Logic: Fetches the "Nice List"
 */
export async function getXmasGiftingList(fid: number) {
  if (!fid) return [];

  try {
    /**
     * FIX: Neynar SDK v2 'fetchUserInteractions' expects 'fids' 
     * as a comma-separated string or array, but does not accept 'limit'
     */
    const response = await (neynarClient as any).fetchUserInteractions({
      fids: fid.toString(), // Latest documentation uses fids as a string
    });

    // Extract users from the nested response structure
    const users = response.result?.users || [];

    // Filter for users who have verified Base wallets
    return users.filter((user: any) => 
      user.verifications && user.verifications.length > 0
    );
  } catch (error) {
    console.error("Neynar Engine Error:", error);
    return [];
  }
}