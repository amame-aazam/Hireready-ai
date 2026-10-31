import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface ColdStartBannerProps {
  apiBaseUrl?: string;
}

export const ColdStartBanner: React.FC<ColdStartBannerProps> = ({
  apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000',
}) => {
  const [isWakingUp, setIsWakingUp] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const timeoutTimer = setTimeout(() => {
      // If server hasn't answered within 2 seconds, it is likely spinning up from cold sleep
      if (isMounted && isOnline === null) {
        setIsWakingUp(true);
      }
    }, 2000);

    const checkServerHealth = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          method: 'GET',
        });
        if (response.ok && isMounted) {
          setIsOnline(true);
          setIsWakingUp(false);
        }
      } catch {
        if (isMounted) {
          setIsWakingUp(true);
          setIsOnline(false);
        }
      } finally {
        clearTimeout(timeoutTimer);
      }
    };

    checkServerHealth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
    };
  }, [apiBaseUrl, isOnline]);

  if (!isWakingUp && isOnline !== false) {
    return null;
  }

  return (
    <aside
      aria-label="Server status notice"
      className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 text-xs text-amber-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {isWakingUp ? (
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-400" />
        )}
        <span>
          <strong>Backend Notice:</strong> Connecting to server. Render Free instances spin down after 15 min of inactivity and may take 30-45 seconds to wake up.
        </span>
      </div>
      {isOnline === true && (
        <span className="flex items-center gap-1 text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
        </span>
      )}
    </aside>
  );
};
