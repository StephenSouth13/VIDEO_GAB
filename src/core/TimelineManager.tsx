import { useEffect } from 'react';
import { startShowClock, stopShowClock } from './ShowClock';

export default function TimelineManager() {
  useEffect(() => {
    const isEmbeddedIframe = window !== window.top && window.location.search.includes('edit=true');
    if (isEmbeddedIframe) return;

    startShowClock();
    return () => stopShowClock();
  }, []);

  return null;
}
