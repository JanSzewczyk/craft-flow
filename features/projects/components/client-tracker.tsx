"use client";

import * as React from "react";

type ClientTrackerProps = {
  token: string;
  onTrackAction(token: string): Promise<void>;
};

export function ClientTracker({ token, onTrackAction }: ClientTrackerProps) {
  React.useEffect(() => {
    void onTrackAction(token);
    const interval = setInterval(() => void onTrackAction(token), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token, onTrackAction]);

  return null;
}
