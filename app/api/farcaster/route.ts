import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: { header: "", payload: "", signature: "" },
    baseBuilder: { ownerAddress: process.env.FARCASTER_OWNER_ADDRESS },
    miniapp: {
      version: "1",
      name: "Daily GM Mini App",
      homeUrl: process.env.NEXT_PUBLIC_URL,
      iconUrl: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
      splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/splash.png`,
      splashBackgroundColor: "#111111",
      webhookUrl: `${process.env.NEXT_PUBLIC_URL}/api/webhook`,
      subtitle: "Daily GM for users",
      description: "Claim GM token daily on Base + Warpcast",
      screenshotUrls: [],
      primaryCategory: "social",
      tags: ["dailygm", "miniapp", "baseapp"],
      heroImageUrl: `${process.env.NEXT_PUBLIC_URL}/og.png`,
      tagline: "Claim instantly",
      ogTitle: "Daily GM",
      ogDescription: "Claim GM token daily via Base + Warpcast",
      ogImageUrl: `${process.env.NEXT_PUBLIC_URL}/og.png`,
      noindex: true
    }
  };

  return NextResponse.json(manifest);
}
