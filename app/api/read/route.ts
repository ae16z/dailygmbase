import { NextResponse } from "next/server";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x1e87B0f7F71B2c217dc68004e4fc81c27C44a651";
const ABI = ["function lastGM(address) view returns (uint256)"];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");
    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider("https://mainnet.base.org");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const lastGm = await contract.lastGM(address);

    return NextResponse.json({ lastGm: lastGm.toString() });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

