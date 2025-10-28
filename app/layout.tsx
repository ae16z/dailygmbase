'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = getDefaultConfig({
  appName: 'Daily GM',
  projectId: '110691ad-3c0e-4b96-a4e8-da15350a856a', // ganti dengan project ID kamu
  chains: [base],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: '#111',
          color: '#fff',
          fontFamily: 'sans-serif',
          margin: 0,
          padding: 0,
        }}
      >
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()}>
              {children}
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}

