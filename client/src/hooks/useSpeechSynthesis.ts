import { useState, useEffect, useCallback } from "react";

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

  const speakText = useCallback(async (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  }) => {
    if (!text.trim()) return;
    
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    // Stop any current speech
    if (globalState.isPlaying || globalState.isPaused) {
      window.speechSynthesis.cancel();
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
  }, []);

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

  return {
    ...state,
    speakText,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    toggleSpeech,
  };
}