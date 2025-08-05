import React, { useEffect, useState } from 'react';

interface AudioWaveAnimationProps {
  isPlaying: boolean;
  className?: string;
}

export function AudioWaveAnimation({ isPlaying, className = "" }: AudioWaveAnimationProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      setBars(new Array(5).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 0.8 + 0.2));
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    // Initialize bars
    setBars(new Array(5).fill(0.1));
  }, []);

  if (!isPlaying && bars.every(bar => bar <= 0.1)) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`} style={{ minWidth: '40px', minHeight: '40px' }}>
      {bars.map((height, index) => (
        <div
          key={index}
          className="bg-green-500 rounded-full transition-all duration-150 ease-in-out"
          style={{
            width: '4px',
            height: `${Math.max(height * 40, 4)}px`,
            opacity: isPlaying ? 0.8 : 0.3,
            transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.3)',
          }}
        />
      ))}
    </div>
  );
}