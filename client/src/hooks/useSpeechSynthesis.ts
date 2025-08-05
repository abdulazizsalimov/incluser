import { useState, useEffect, useCallback } from "react";

// Global speech engine preference
let globalSpeechEngine: 'browser' | 'rhvoice' = 'rhvoice'; // Default to RHVoice
let globalRHVoiceSettings = {
  rate: 50,
  pitch: 50,
  volume: 100,
  voice: 'elena'
};

interface SpeechSynthesisState {
  isPlaying: boolean;
  isPaused: boolean;
  currentText: string;
  currentUtterance: SpeechSynthesisUtterance | null;
}

const initialState: SpeechSynthesisState = {
  isPlaying: false,
  isPaused: false,
  currentText: "",
  currentUtterance: null,
};

// Global state for speech synthesis to avoid conflicts
let globalState = initialState;
const listeners: Array<(state: SpeechSynthesisState) => void> = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalState));
};

const updateGlobalState = (updates: Partial<SpeechSynthesisState>) => {
  globalState = { ...globalState, ...updates };
  notifyListeners();
};

export function useSpeechSynthesis() {
  const [state, setState] = useState<SpeechSynthesisState>(globalState);

  useEffect(() => {
    const listener = (newState: SpeechSynthesisState) => {
      setState(newState);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  // Queue system for long text playback
  const audioQueue: HTMLAudioElement[] = [];
  let currentAudioIndex = 0;
  let isQueuePlaying = false;

  // Function to split text into sentences
  const splitTextIntoSentences = (text: string): string[] => {
    // Split by sentence endings, keeping sentences reasonable length
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');
    
    // Further split very long sentences (over 500 chars) by commas
    const finalSentences: string[] = [];
    sentences.forEach(sentence => {
      if (sentence.length > 500) {
        const parts = sentence.split(',').map(p => p.trim()).filter(p => p.length > 0);
        finalSentences.push(...parts);
      } else {
        finalSentences.push(sentence);
      }
    });
    
    return finalSentences;
  };

  // Function to speak with RHVoice
  const speakWithRHVoice = useCallback(async (text: string): Promise<void> => {
    try {
      console.log('RHVoice text length:', text.length);
      console.log('RHVoice settings:', globalRHVoiceSettings);
      
      // For long texts, split into sentences and queue them
      if (text.length > 800) {
        console.log('Long text detected, splitting into sentences');
        const sentences = splitTextIntoSentences(text);
        console.log('Split into', sentences.length, 'sentences');
        
        // Clear any existing queue
        audioQueue.length = 0;
        currentAudioIndex = 0;
        
        // Create audio elements for each sentence
        for (const sentence of sentences) {
          const params = new URLSearchParams({
            text: sentence,
            voice: globalRHVoiceSettings.voice,
            format: 'mp3',
            rate: globalRHVoiceSettings.rate.toString(),
            pitch: globalRHVoiceSettings.pitch.toString(),
            volume: globalRHVoiceSettings.volume.toString()
          });

          const url = `/api/rhvoice/say?${params.toString()}`;
          const audio = new Audio(url);
          audioQueue.push(audio);
        }
        
        // Play the queue
        return new Promise((resolve, reject) => {
          updateGlobalState({
            isPlaying: true,
            isPaused: false,
            currentText: text,
            currentUtterance: null,
          });
          
          isQueuePlaying = true;
          
          const playNext = () => {
            if (currentAudioIndex >= audioQueue.length || !isQueuePlaying) {
              updateGlobalState({
                isPlaying: false,
                isPaused: false,
                currentText: "",
                currentUtterance: null,
              });
              resolve();
              return;
            }
            
            const audio = audioQueue[currentAudioIndex];
            
            audio.onended = () => {
              currentAudioIndex++;
              playNext();
            };
            
            audio.onerror = (event) => {
              console.error('Queue audio error:', event);
              currentAudioIndex++;
              playNext(); // Continue with next sentence
            };
            
            audio.play().catch((e) => {
              console.error('Queue audio play error:', e);
              currentAudioIndex++;
              playNext(); // Continue with next sentence
            });
          };
          
          playNext();
        });
      } else {
        // Short text - direct playback
        console.log('Using GET request for short text');
        const params = new URLSearchParams({
          text: text,
          voice: globalRHVoiceSettings.voice,
          format: 'mp3',
          rate: globalRHVoiceSettings.rate.toString(),
          pitch: globalRHVoiceSettings.pitch.toString(),
          volume: globalRHVoiceSettings.volume.toString()
        });

        const url = `/api/rhvoice/say?${params.toString()}`;
        console.log('RHVoice GET URL:', url);

        const audio = new Audio(url);
        
        updateGlobalState({
          isPlaying: true,
          isPaused: false,
          currentText: text,
          currentUtterance: null,
        });
        
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            reject(new Error('RHVoice audio timeout'));
          }, 10000);

          audio.onended = () => {
            clearTimeout(timeout);
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            resolve();
          };
          
          audio.onerror = (event) => {
            clearTimeout(timeout);
            console.error('Audio playback error:', event);
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            reject(new Error(`RHVoice audio playback failed`));
          };
          
          audio.play().catch((e) => {
            clearTimeout(timeout);
            console.error('Audio play() error:', e);
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            reject(new Error(`RHVoice playback error: ${e.message}`));
          });
        });
      }
    } catch (error: any) {
      console.error('RHVoice error details:', error);
      throw error;
    }
  }, []);

  const speakText = useCallback(async (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
    forceEngine?: 'browser' | 'rhvoice';
  }) => {
    if (!text.trim()) return;
    
    console.log('speakText called with:', { text: text.substring(0, 50) + '...', options, globalSpeechEngine });
    
    // Stop any current speech
    if (globalState.isPlaying || globalState.isPaused) {
      window.speechSynthesis.cancel();
    }

    const engineToUse = options?.forceEngine || globalSpeechEngine;

    // Try RHVoice first if it's the preferred engine
    if (engineToUse === 'rhvoice') {
      try {
        await speakWithRHVoice(text);
        return;
      } catch (error) {
        console.warn('RHVoice failed, falling back to browser:', error);
        // Fall through to browser synthesis
      }
    }

    // Browser synthesis fallback
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;
    utterance.lang = 'ru-RU';

    // Find Russian voice if available
    const voices = window.speechSynthesis.getVoices();
    const russianVoice = voices.find(voice => voice.lang.startsWith('ru'));
    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    // Set up event handlers
    utterance.onstart = () => {
      updateGlobalState({
        isPlaying: true,
        isPaused: false,
        currentText: text,
        currentUtterance: utterance,
      });
    };

    utterance.onend = () => {
      updateGlobalState({
        isPlaying: false,
        isPaused: false,
        currentText: "",
        currentUtterance: null,
      });
    };

    utterance.onerror = () => {
      updateGlobalState({
        isPlaying: false,
        isPaused: false,
        currentText: "",
        currentUtterance: null,
      });
    };

    updateGlobalState({
      currentUtterance: utterance,
      currentText: text,
    });

    window.speechSynthesis.speak(utterance);
  }, [speakWithRHVoice]);

  const pauseSpeech = useCallback(() => {
    if (globalState.isPlaying) {
      // Pause browser speech synthesis
      if (window.speechSynthesis && globalState.currentUtterance) {
        window.speechSynthesis.pause();
      }
      
      // Pause current RHVoice audio
      if (audioQueue.length > 0 && currentAudioIndex < audioQueue.length) {
        audioQueue[currentAudioIndex].pause();
      }
      
      updateGlobalState({
        isPlaying: false,
        isPaused: true,
        currentText: globalState.currentText,
        currentUtterance: globalState.currentUtterance,
      });
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    if (globalState.isPaused) {
      // Resume browser speech synthesis
      if (window.speechSynthesis && globalState.currentUtterance) {
        window.speechSynthesis.resume();
      }
      
      // Resume current RHVoice audio
      if (audioQueue.length > 0 && currentAudioIndex < audioQueue.length) {
        audioQueue[currentAudioIndex].play();
        isQueuePlaying = true;
      }
      
      updateGlobalState({
        isPlaying: true,
        isPaused: false,
        currentText: globalState.currentText,
        currentUtterance: globalState.currentUtterance,
      });
    }
  }, []);

  const stopSpeech = useCallback(() => {
    // Stop browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Stop RHVoice queue
    isQueuePlaying = false;
    audioQueue.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    audioQueue.length = 0;
    currentAudioIndex = 0;
    
    updateGlobalState({
      isPlaying: false,
      isPaused: false,
      currentText: "",
      currentUtterance: null,
    });
  }, []);

  const toggleSpeech = useCallback(async (text?: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }) => {
    if (globalState.isPlaying) {
      pauseSpeech();
    } else if (globalState.isPaused) {
      resumeSpeech();
    } else if (text) {
      await speakText(text, options);
    }
  }, [speakText, pauseSpeech, resumeSpeech]);

  // Functions to update global settings
  const setSpeechEngine = useCallback((engine: 'browser' | 'rhvoice') => {
    globalSpeechEngine = engine;
  }, []);

  const setRHVoiceSettings = useCallback((settings: { rate: number; pitch: number; volume: number; voice: string }) => {
    globalRHVoiceSettings = settings;
  }, []);

  return {
    ...state,
    speakText,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    toggleSpeech,
    setSpeechEngine,
    setRHVoiceSettings,
    currentEngine: globalSpeechEngine,
  };
}