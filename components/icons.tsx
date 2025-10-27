import React from 'react';

export const EggIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 6.13 5 11c0 4.08 2.86 7.42 6.5 7.92V20c0 .55.45 1 1 1h.02c.55 0 1-.45 1-1v-1.08C16.14 18.42 19 15.08 19 11c0-4.87-3.13-9-7-9zm0 16c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
);

export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7.31 17.75 11 14 17 14V8z"/>
    <path d="M21 12c-4.27 0-8-3.33-8-7.5C13 2.5 14.5 1 16.5 1S20 2.5 20 4.5c0 1.1-.9 2-2 2s-2-.9-2-2c0-.37.1-.71.28-1.02C15.93 1.94 15 3.43 15 5.5c0 3.58 3.03 6.5 7 6.5V12z"/>
  </svg>
);

export const DrumstickIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.78 12.15l-1.32-1.32c-.4-.4-.93-.63-1.48-.63c-1.3 0-2.43.83-2.85 2.02l-4.13 1.18V8.18l3.18-1.59c.59-.29 1.25-.4 1.92-.4c1.66 0 3 1.34 3 3c0 .3-.04.59-.11.86l2.11-2.11c.78-.78.78-2.05 0-2.83l-1.41-1.41c-.78-.78-2.05-.78-2.83 0L12.01 7.2V3c0-1.1-.9-2-2-2s-2 .9-2 2v6.18l-3.79-1.27C3.41 7.55 2.59 8.12 2.36 9c-.3.94.18 1.91 1.05 2.37l5.44 2.86c.61.32 1.32.33 1.94.02l1.62-.81l-1.62-1.62c-.59-.59-.59-1.54 0-2.12c.59-.59 1.54-.59 2.12 0l4.24 4.24c.59.59.59 1.54 0 2.12c-.59.59-1.54.59-2.12 0l-2.09-2.09l-3.87 2.23c-.64.37-1.05 1.05-1.05 1.78v4.25c0 .55.45 1 1 1s1-.45 1-1v-3.75l2.6-1.5c.32-.18.69-.26 1.06-.26c1.66 0 3-1.34 3-3c0-.49-.12-.95-.33-1.35z"/>
  </svg>
);

export const SkipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);
