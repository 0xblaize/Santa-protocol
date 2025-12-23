import { NextResponse } from 'next/server';
import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';

// 1. Setup the Base Client
const publicClient = createPublicClient({
  chain: base,
  transport: http(), // Uses default Base RPC
});

const TREASURY_ADDRESS = "0xaAcD391C93AC4c8e6CFD17E5c1487dD098a2A6a5" as `0x${string}`;

export async function GET() {
  try {
    // 2. Fetch the live ETH balance from Base
    const balanceWei = await publicClient.getBalance({ 
      address: TREASURY_ADDRESS 
    });

    // 3. Convert Wei to readable ETH
    const balanceEth = formatEther(balanceWei);

    /** * 4. PROFIT CALCULATION
     * If you store your tax profit in the same wallet, you can return 
     * a percentage or a specific sub-balance here.
     */
    const estimatedProfit = (parseFloat(balanceEth) * 0.01).toFixed(4); // Example: 1% Tax

    return NextResponse.json({
      treasuryTotal: parseFloat(balanceEth).toFixed(4),
      profitFees: estimatedProfit,
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Failed to fetch admin stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}