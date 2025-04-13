"use client";
import React, { useState, useEffect } from 'react';
import './ClaimCoin.css';
import { MiniKit } from '@worldcoin/minikit-js';

// Types
type ClaimCoinProps = {
  userAddress: string;
};

type TabType = 'claim';

type SocialPlatform = 'telegram' | 'twitter';

// Social platform configuration
const socialPlatforms: Record<SocialPlatform, {
  name: string;
  color: string;
  url: string;
  icon: React.ReactNode;
}> = {
  telegram: {
    name: 'Telegram',
    color: '#0088cc',
    url: 'https://t.me/tpulsefi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
      </svg>
    )
  },
  twitter: {
    name: 'Twitter',
    color: '#1DA1F2',
    url: 'https://x.com/TradePulseToken?t=pVsX5va6z7eOJj70W9pSog&s=09',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
};

export function ClaimCoin({ userAddress }: ClaimCoinProps) {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('claim');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [socialFollowed, setSocialFollowed] = useState<Record<SocialPlatform, boolean>>({
    telegram: false,
    twitter: false,
  });
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Check wallet connection on load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (MiniKit.isInstalled()) {
          const accounts = await MiniKit.getAccounts();
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            setWalletAddress(accounts[0]);
          }
        }
      } catch (err) {
        console.error('Error checking wallet connection:', err);
      }
    };

    checkConnection();
  }, []);

  // ... (keep existing useEffect hooks for social status and claim status)

  const connectWallet = async () => {
    try {
      if (!MiniKit.isInstalled()) {
        setError('Please install MiniKit wallet extension');
        return false;
      }

      const accounts = await MiniKit.connect();
      if (accounts && accounts.length > 0) {
        setIsConnected(true);
        setWalletAddress(accounts[0]);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect wallet');
      return false;
    }
  };

  const handleClaim = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    try {
      if (!allSocialFollowed) {
        setError('Please follow our Telegram and Twitter accounts to claim your rewards');
        return;
      }

      setIsClaiming(true);
      setError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update local storage with claim time
      localStorage.setItem(`lastClaim_${userAddress}`, new Date().toISOString());

      // Update balance
      setBalance(prevBalance => prevBalance + 50);

      // Show success screen
      setClaimSuccess(true);

      // Reset after showing success
      setTimeout(() => {
        setHasClaimed(true);
        setClaimSuccess(false);
        setCountdown({ hours: 23, minutes: 59, seconds: 59 });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim coins');
    } finally {
      setIsClaiming(false);
    }
  };

  // ... (keep existing render functions)

  return (
    <div className="claim-coin-container">
      {walletAddress && (
        <div className="wallet-info">
          <span className="wallet-address">
            {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
          </span>
        </div>
      )}

      <h1 className='text-blue-800'>Daily TPulseFi Claim</h1>
      <p>Claim your daily rewards and earn TPulseFi tokens</p>

      <div className="tab-container">
        <button
          onClick={() => setActiveTab('claim')}
          className={`tab-button ${activeTab === 'claim' ? 'active' : ''}`}
          aria-label="View Claim Tab"
        >
          Claim Tokens
        </button>
      </div>

      {activeTab === 'claim' && (
        <div className="claim-section">
          <div className="reward-card">
            <h2>Daily Reward</h2>
            <div className="reward-amount">
              <span>50 TPulseFi</span>
            </div>

            <div className="claim-status">
              <span className={hasClaimed ? 'claimed' : 'available'}>
                {hasClaimed ? 'Claimed' : 'Available'}
              </span>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button
              onClick={handleClaim}
              disabled={isClaiming || hasClaimed}
              className="claim-button"
              aria-label={isConnected ? "Claim rewards" : "Connect wallet"}
            >
              {isClaiming ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : hasClaimed ? (
                'Already Claimed'
              ) : !isConnected ? (
                'Connect Wallet'
              ) : !allSocialFollowed ? (
                'Follow All Channels to Claim'
              ) : (
                'Claim 50 TPulseFi Now'
              )}
            </button>

            {hasClaimed && countdown && (
              <div className="countdown-container" aria-label="Time until next claim">
                <div className="countdown-item">
                  <div className="countdown-value">{countdown.hours.toString().padStart(2, '0')}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-value">{countdown.minutes.toString().padStart(2, '0')}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-value">{countdown.seconds.toString().padStart(2, '0')}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
            )}
          </div>

          <div className="follow-card">
            <h2 className='text-blue-800'>Follow Requirements</h2>
            <p>Follow our official channels to claim</p>

            <div className="social-grid">
              {Object.keys(socialPlatforms).map((platform) =>
                renderSocialButtons(platform as SocialPlatform)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}