// app/.well-known/farcaster/route.ts
import { NextResponse } from 'next/server';

function withValidProperties(properties: Record<string, undefined | string | string[] | Record<string, any>>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      value && (Array.isArray(value) ? value.length > 0 : typeof value === 'object' ? Object.keys(value).length > 0 : true)
    )
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;
  const OWNER = process.env.NEXT_PUBLIC_BASE_OWNER;

  const manifest = withValidProperties({
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    baseBuilder: {
      ownerAddress: OWNER
    },
    miniapp: {
      version: "1",
      name: "Daily GM",
      homeUrl: URL,
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#111111",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Daily GM token app",
      description: "Claim daily GM tokens and interact with the app.",
      screenshotUrls: [
        `${URL}/screenshot1.png`,
        `${URL}/screenshot2.png`,
        `${URL}/screenshot3.png`
      ],
      primaryCategory: "finance",
      tags: ["daily", "gm", "token", "miniapp"],
      heroImageUrl: `${URL}/og.png`,
      tagline: "Claim, stake, earn",
      ogTitle: "Daily GM MiniApp",
      ogDescription: "Claim your daily GM tokens and stake for rewards.",
      ogImageUrl: `${URL}/og.png`,
      noindex: true
    }
  });

  return NextResponse.json(manifest);
}
