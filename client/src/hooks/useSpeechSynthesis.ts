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
      // КРИТИЧЕСКИ ВАЖНО: Полностью остановить браузерный синтезатор
      console.log('Stopping browser synthesis before RHVoice');
      window.speechSynthesis.cancel();
      
      // Ждем немного чтобы убедиться что браузерный синтезатор остановлен
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
        
        // Create audio elements for each sentence (without preloading)
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
          // Don't create Audio element yet, just store the URL
          audioQueue.push({ url, sentence, audio: null } as any);
        }
        
        // Play the queue
        return new Promise((resolve, reject) => {
          // КРИТИЧЕСКИ ВАЖНО: Еще раз останавливаем браузерный синтезатор перед началом очереди
          console.log('Final browser synthesis stop before queue playback');
          window.speechSynthesis.cancel();
          
          updateGlobalState({
            isPlaying: true,
            isPaused: false,
            currentText: text,
            currentUtterance: null,
          });
          
          isQueuePlaying = true;
          
          const playNext = async () => {
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
            
            const queueItem = audioQueue[currentAudioIndex] as any;
            console.log(`Playing sentence ${currentAudioIndex + 1}/${audioQueue.length}:`, queueItem.sentence.substring(0, 50) + '...');
            
            // Create audio element only when needed
            if (!queueItem.audio) {
              queueItem.audio = new Audio(queueItem.url);
            }
            
            const audio = queueItem.audio;
            
            // Add a small delay to avoid overwhelming the server
            if (currentAudioIndex > 0) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
            
            audio.onended = () => {
              console.log(`Finished sentence ${currentAudioIndex + 1}`);
              currentAudioIndex++;
              setTimeout(() => playNext(), 100); // Small gap between sentences
            };
            
            audio.onerror = (event: any) => {
              console.error(`Queue audio error for sentence ${currentAudioIndex + 1}:`, event, 'URL:', audio.src);
              // Пропускаем проблемное предложение и переходим к следующему
              currentAudioIndex++;
              setTimeout(() => playNext(), 100); // Continue with next sentence
            };
            
            audio.onloadstart = () => {
              console.log(`Loading sentence ${currentAudioIndex + 1}`);
            };
            
            audio.oncanplay = () => {
              console.log(`Ready to play sentence ${currentAudioIndex + 1}`);
            };
            
            try {
              await audio.play();
              console.log(`Successfully started playing sentence ${currentAudioIndex + 1}`);
            } catch (e) {
              console.error(`Queue audio play error for sentence ${currentAudioIndex + 1}:`, e, 'URL:', audio.src);
              // Пропускаем проблемное предложение и переходим к следующему
              currentAudioIndex++;
              setTimeout(() => playNext(), 100); // Continue with next sentence
            }
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
          // Увеличенный timeout для длинных текстов
          const timeoutDuration = Math.max(30000, text.length * 100); // минимум 30сек или 100мс на символ
          console.log(`RHVoice timeout set to ${timeoutDuration}ms for text length ${text.length}`);
          
          const timeout = setTimeout(() => {
            console.error('RHVoice timeout reached');
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            reject(new Error('RHVoice audio timeout'));
          }, timeoutDuration);

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
          
          audio.onerror = (event: any) => {
            clearTimeout(timeout);
            console.error('Audio playback error:', event, 'URL:', audio.src);
            updateGlobalState({
              isPlaying: false,
              isPaused: false,
              currentText: "",
              currentUtterance: null,
            });
            reject(new Error(`RHVoice audio playback failed: ${event.type}`));
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
    
    // КРИТИЧЕСКИ ВАЖНО: Полностью остановить любую текущую речь
    console.log('Stopping all current speech synthesis');
    window.speechSynthesis.cancel();
    
    // Останавливаем RHVoice аудио если играет
    if (globalState.isPlaying || globalState.isPaused) {
      const allAudio = document.querySelectorAll('audio');
      allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    
    // Сбрасываем состояние
    updateGlobalState({
      isPlaying: false,
      isPaused: false,
      currentText: "",
      currentUtterance: null,
    });

    const engineToUse = options?.forceEngine || globalSpeechEngine;

    // Try RHVoice first if it's the preferred engine
    if (engineToUse === 'rhvoice') {
      try {
        console.log('Using RHVoice engine');
        await speakWithRHVoice(text);
        console.log('RHVoice playback completed successfully');
        return;
      } catch (error) {
        console.error('RHVoice failed completely, NOT falling back to prevent double speech:', error);
        // КРИТИЧЕСКИ ВАЖНО: НЕ переходим на браузерный синтезатор для избежания двойной речи
        updateGlobalState({
          isPlaying: false,
          isPaused: false,
          currentText: "",
          currentUtterance: null,
        });
        throw error; // Прерываем выполнение вместо fallback
      }
    }

    // Browser synthesis fallback
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    console.log('Using browser synthesis fallback');
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
        const queueItem = audioQueue[currentAudioIndex] as any;
        if (queueItem.audio) {
          queueItem.audio.pause();
        }
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
        const queueItem = audioQueue[currentAudioIndex] as any;
        if (queueItem.audio) {
          queueItem.audio.play();
          isQueuePlaying = true;
        }
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
    console.log('STOP: Completely stopping all speech synthesis');
    
    // Stop browser synthesis MULTIPLE TIMES to be sure
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setTimeout(() => window.speechSynthesis.cancel(), 10);
      setTimeout(() => window.speechSynthesis.cancel(), 50);
      setTimeout(() => window.speechSynthesis.cancel(), 100);
    }
    
    // Stop RHVoice queue
    isQueuePlaying = false;
    audioQueue.forEach((queueItem: any) => {
      if (queueItem.audio) {
        console.log('Stopping RHVoice audio element:', queueItem.audio.src);
        queueItem.audio.pause();
        queueItem.audio.currentTime = 0;
        // Remove the audio element to prevent any further issues
        if (queueItem.audio.parentNode) {
          queueItem.audio.parentNode.removeChild(queueItem.audio);
        }
      }
    });
    audioQueue.length = 0;
    currentAudioIndex = 0;
    
    // Also stop any other audio elements on the page
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      console.log('Stopping additional audio element:', audio.src);
      audio.pause();
      audio.currentTime = 0;
    });
    
    updateGlobalState({
      isPlaying: false,
      isPaused: false,
      currentText: "",
      currentUtterance: null,
    });
    
    console.log('STOP: All speech synthesis stopped');
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