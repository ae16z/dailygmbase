// app/.well-known/farcaster/route.ts
import { NextResponse } from 'next/server';

function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value
    )
  );
}

export async function GET() {
  const manifest = withValidProperties({
    name: "Daily GM",
    description: "Daily GM token app",
    projectId: "110691ad-3c0e-4b96-a4e8-da15350a856a",
    url: process.env.NEXT_PUBLIC_URL,
    icons: [
      `${process.env.NEXT_PUBLIC_URL}/icon-192.png`,
      `${process.env.NEXT_PUBLIC_URL}/icon-512.png`,
    ],
  });

  return NextResponse.json(manifest);
}

