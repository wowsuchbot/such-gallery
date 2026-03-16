// such.gallery - Farcaster Mini App integration

'use client';

import { useEffect, useState } from 'react';

export interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

export interface FrameContext {
  user?: FarcasterUser;
  isAuthenticated: boolean;
}

// Hook for Farcaster Frame SDK
export function useFarcaster() {
  const [context, setContext] = useState<FrameContext>({
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check if running in Farcaster
    if (typeof window !== 'undefined' && window.parent !== window) {
      // Listen for frame context
      window.addEventListener('message', (event) => {
        if (event.data?.type === 'frameContext') {
          setContext({
            user: event.data.user,
            isAuthenticated: !!event.data.user,
          });
        }
      });
    }
  }, []);

  return context;
}

// Generate Farcaster Frame embed URL
export function getFrameUrl(galleryId?: string): string {
  const baseUrl = 'https://such.gallery';
  return galleryId ? `${baseUrl}/gallery/${galleryId}` : baseUrl;
}

// Share to Farcaster (opens cast composer)
export function shareToFarcaster(text: string, url: string): void {
  const castText = encodeURIComponent(`${text}\n\n${url}`);
  window.open(`https://warpcast.com/~/compose?text=${castText}`, '_blank');
}
