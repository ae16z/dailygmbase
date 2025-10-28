'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseAbi } from 'viem';

// === Kontrak ===
const CONTRACT_ADDRESS = '0x1e87B0f7F71B2c217dc68004e4fc81c27C44a651';
const ABI = parseAbi([
  'function gm() external',
  'function lastGM(address) view returns (uint256)',
]);

export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const [gmToday, setGmToday] = useState(false);
  const [nextGM, setNextGM] = useState<number | null>(null);
  const [status, setStatus] = useState('Say GM to earn your blessings ☀️');
  const [gmList, setGmList] = useState<{ user: string; time: number }[]>([]);

  // ====== Cek status GM user ======
  async function checkGmStatus() {
    if (!isConnected || !address) return;
    try {
      const res = await fetch(`/api/read?address=${address}`);
      const data = await res.json();

      const lastGm = BigInt(data.lastGm || 0);
      const now = BigInt(Math.floor(Date.now() / 1000));

      if (now - lastGm < BigInt(86400)) {
        setGmToday(true);
        setNextGM(Number(lastGm) + 86400);
        setStatus('✅ You already said GM today!');
      } else {
        setGmToday(false);
        setStatus('☀️ Ready to GM again!');
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ====== Kirim GM ======
  async function sendGm() {
    if (!isConnected) {
      setStatus('⚠️ Please connect your wallet first.');
      return;
    }

    try {
      setStatus('⏳ Sending GM...');
      await writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'gm',
      });

      setStatus('✅ GM sent successfully!');
      setGmToday(true);
      setNextGM(Math.floor(Date.now() / 1000) + 86400);

      // Simpan ke leaderboard
      setGmList((prev) => [
        ...prev,
        { user: address!, time: Math.floor(Date.now() / 1000) },
      ]);
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Transaction failed.');
    }
  }

  useEffect(() => {
    checkGmStatus();
  }, [isConnected, address]);

  // ====== UI ======
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #000000, #1a1a1a)',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: 500,
          padding: 30,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 16,
          boxShadow: '0 0 20px rgba(255,255,255,0.1)',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: 20 }}>🌅 Daily GM</h1>

        <ConnectButton />

        <p style={{ marginTop: 20, minHeight: 24 }}>{status}</p>

        <button
          onClick={sendGm}
          disabled={!isConnected || isPending || gmToday}
          style={{
            marginTop: 20,
            padding: '10px 25px',
            background: !isConnected
              ? '#333'
              : gmToday
              ? '#555'
              : '#00cc88',
            color: 'white',
            borderRadius: 10,
            border: 'none',
            cursor: !isConnected
              ? 'not-allowed'
              : gmToday
              ? 'not-allowed'
              : 'pointer',
            fontSize: '1rem',
            transition: '0.3s',
          }}
          onMouseEnter={(e) =>
            !gmToday &&
            isConnected &&
            (e.currentTarget.style.background = '#00e69b')
          }
          onMouseLeave={(e) =>
            !gmToday &&
            isConnected &&
            (e.currentTarget.style.background = '#00cc88')
          }
        >
          {isPending
            ? 'Processing...'
            : !isConnected
            ? 'Connect wallet to GM'
            : gmToday
            ? 'Already GM ☀️'
            : 'Send GM'}
        </button>

        {nextGM && (
          <p style={{ marginTop: 20 }}>
            ⏰ Next GM available at:{' '}
            <span style={{ color: '#00e69b' }}>
              {new Date(nextGM * 1000).toLocaleString()}
            </span>
          </p>
        )}

        <div style={{ marginTop: 30 }}>
          <h3>🌍 GM Leaderboard (Today)</h3>
          {gmList.length === 0 ? (
            <p>No one has said GM yet!</p>
          ) : (
            <ul style={{ textAlign: 'left', marginTop: 10 }}>
              {gmList.map((item, idx) => (
                <li key={idx}>
                  {item.user.slice(0, 6)}...{item.user.slice(-4)} —{' '}
                  {new Date(item.time * 1000).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}

