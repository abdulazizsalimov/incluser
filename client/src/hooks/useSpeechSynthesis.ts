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

  // Function to speak with RHVoice
  const speakWithRHVoice = useCallback(async (text: string): Promise<void> => {
    try {
      const params = new URLSearchParams({
        text: text,
        voice: globalRHVoiceSettings.voice,
        format: 'mp3',
        rate: globalRHVoiceSettings.rate.toString(),
        pitch: globalRHVoiceSettings.pitch.toString(),
        volume: globalRHVoiceSettings.volume.toString()
      });

      const url = `/api/rhvoice/say?${params.toString()}`;
      console.log('RHVoice request URL:', url);
      console.log('RHVoice settings:', globalRHVoiceSettings);
      
      // Quick availability check with shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      
      try {
        const testResponse = await fetch(url, { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!testResponse.ok) {
          throw new Error(`RHVoice server unavailable (${testResponse.status})`);
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        throw new Error(`RHVoice server unavailable: ${fetchError.message}`);
      }
      
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
        }, 8000);

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
        audio.onerror = () => {
          clearTimeout(timeout);
          updateGlobalState({
            isPlaying: false,
            isPaused: false,
            currentText: "",
            currentUtterance: null,
          });
          reject(new Error('RHVoice audio playback failed'));
        };
        
        audio.play().catch((e) => {
          clearTimeout(timeout);
          updateGlobalState({
            isPlaying: false,
            isPaused: false,
            currentText: "",
            currentUtterance: null,
          });
          reject(new Error(`RHVoice playback error: ${e.message}`));
        });
      });
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
    if (window.speechSynthesis && globalState.isPlaying) {
      window.speechSynthesis.pause();
      updateGlobalState({
        isPlaying: false,
        isPaused: true,
      });
    }
  }, []);

  const resumeSpeech = useCallback(() => {
    if (window.speechSynthesis && globalState.isPaused) {
      window.speechSynthesis.resume();
      updateGlobalState({
        isPlaying: true,
        isPaused: false,
      });
    }
  }, []);

  const stopSpeech = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
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