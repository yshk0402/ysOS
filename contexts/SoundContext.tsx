import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

type SoundType = 'startup' | 'click' | 'error' | 'shutdown' | 'close';

interface SoundContextType {
    volume: number;
    isMuted: boolean;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
    playSound: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const playSound = useCallback((type: SoundType) => {
        if (isMuted) return;
        const ctx = initAudio();
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.value = volume / 100;

        const t = ctx.currentTime;

        if (type === 'click') {
            // Short high-pitch blip
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.1);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'close') {
            // Window Close sound (Descending blip)
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.15);
            
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(t);
            osc.stop(t + 0.15);
        } else if (type === 'error') {
            // "Chord" sound (Windows Error)
            const freqs = [880, 440]; 
            freqs.forEach(f => {
                const osc = ctx.createOscillator();
                osc.type = 'square';
                osc.frequency.value = f;
                
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(t);
                osc.stop(t + 0.4);
            });
        } else if (type === 'startup') {
            // The "Windows 95" Sound (Simplified Pad)
            const notes = [
                261.63, // C4
                329.63, // E4
                392.00, // G4
                523.25, // C5
                659.25, // E5
                783.99  // G5
            ];
            
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = freq;

                const gain = ctx.createGain();
                // Staggered entry
                const startTime = t + (i * 0.1);
                const duration = 3.0;

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(startTime);
                osc.stop(startTime + duration + 1);
            });
        }
    }, [initAudio, volume, isMuted]);

    return (
        <SoundContext.Provider value={{ volume, isMuted, setVolume, toggleMute: () => setIsMuted(prev => !prev), playSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};