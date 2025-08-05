import React, { useEffect, useState, useRef } from 'react';

interface AudioWaveAnimationProps {
  audioElement?: HTMLAudioElement | null;
  isPlaying: boolean;
  className?: string;
}

export function AudioWaveAnimation({ audioElement, isPlaying, className = "" }: AudioWaveAnimationProps) {
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create many bars for full width coverage
  const barCount = 60;

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      setFrequencyData(new Array(barCount).fill(0));
      return;
    }

    // Initialize audio analysis
    const initializeAudioAnalysis = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        if (!analyserRef.current) {
          analyserRef.current = audioContext.createAnalyser();
          analyserRef.current.fftSize = 256;
          
          const source = audioContext.createMediaElementSource(audioElement);
          source.connect(analyserRef.current);
          analyserRef.current.connect(audioContext.destination);
        }

        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateFrequencyData = () => {
          if (!isPlaying) {
            setFrequencyData(new Array(barCount).fill(0));
            return;
          }

          analyser.getByteFrequencyData(dataArray);
          
          // Process frequency data into bars
          const bars: number[] = [];
          const step = Math.floor(dataArray.length / barCount);
          
          for (let i = 0; i < barCount; i++) {
            const startIndex = i * step;
            const endIndex = Math.min(startIndex + step, dataArray.length);
            
            // Average the frequency data in this range
            let sum = 0;
            for (let j = startIndex; j < endIndex; j++) {
              sum += dataArray[j];
            }
            const average = sum / (endIndex - startIndex);
            
            // Normalize to 0-1 range
            bars.push(average / 255);
          }

          setFrequencyData(bars);
          
          if (isPlaying) {
            animationRef.current = requestAnimationFrame(updateFrequencyData);
          }
        };

        updateFrequencyData();
      } catch (error) {
        console.error('Audio analysis initialization failed:', error);
        // Fallback to simple animation
        setFrequencyData(new Array(barCount).fill(0));
      }
    };

    initializeAudioAnalysis();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isPlaying, barCount]);

  // Clean up audio context when component unmounts
  useEffect(() => {
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Don't render if no audio or not playing
  if (!isPlaying || frequencyData.every(val => val === 0)) {
    return null;
  }

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      <div className="flex items-center justify-center w-full h-full px-8">
        <div className="flex items-center justify-center space-x-1 w-full max-w-4xl">
          {frequencyData.map((amplitude, index) => {
            const height = Math.max(amplitude * 100, 2);
            return (
              <div
                key={index}
                className="bg-green-400 opacity-80 transition-all duration-75 ease-out"
                style={{
                  width: '2px',
                  height: `${height}px`,
                  minHeight: '2px',
                  transform: `scaleY(${Math.max(amplitude * 2, 0.1)})`,
                  boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}