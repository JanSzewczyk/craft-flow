"use client";

import { useEffect } from "react";

type ClientTrackerProps = {
  projectId: string;
  onTrackAction(projectId: string): Promise<void>;
};

export function ClientTracker({ projectId, onTrackAction }: ClientTrackerProps) {
  useEffect(() => {
    void onTrackAction(projectId);
    const interval = setInterval(() => void onTrackAction(projectId), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [projectId, onTrackAction]);

  return null;
}
