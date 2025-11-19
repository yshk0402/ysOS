import React from 'react';
import { useSound } from '../contexts/SoundContext';
import { W95Border } from './SystemUI';
import { useLanguage } from '../contexts/LanguageContext';

export const VolumePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { volume, setVolume, isMuted, toggleMute } = useSound();
    const { language } = useLanguage();

    return (
        <W95Border className="absolute bottom-8 right-0 w-20 bg-[#c0c0c0] p-1 flex flex-col gap-2 z-[9999] shadow-xl">
            <div className="text-xs text-center mb-1 border-b border-gray-400 pb-1 select-none">
                {language === 'ja' ? '音量' : 'Volume'}
            </div>
            
            <div className="flex justify-center h-32 py-2 relative">
                {/* 
                   Slider Logic:
                   We use a standard horizontal range input, rotate it -90deg, and center it.
                   It is invisible (opacity-0) but sits on top (z-20) to capture events.
                */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="absolute w-28 h-8 opacity-0 cursor-pointer z-20"
                        style={{ 
                            transform: 'rotate(-90deg)',
                            appearance: 'none', 
                        }}
                    />

                    {/* Visual Track (The groove) */}
                    <div className="absolute w-1 h-24 bg-gray-600 shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,1),1px_1px_0px_0px_rgba(255,255,255,1)] z-0 pointer-events-none"></div>

                    {/* Visual Thumb (The knob) */}
                    <div 
                        className="absolute w-8 h-4 bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black border-2 shadow-sm pointer-events-none z-10 flex items-center justify-center"
                        style={{ 
                            // Map volume 0-100 to the visual height of the track
                            bottom: `calc(${volume}% * 0.85 + 5%)` 
                        }}
                    >
                        <div className="w-full h-[1px] bg-[#808080] mb-[1px]"></div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1 mb-1 select-none">
                <input 
                    type="checkbox" 
                    checked={isMuted} 
                    onChange={toggleMute}
                    id="mute-check"
                    className="accent-[#000080]"
                />
                <label htmlFor="mute-check" className="text-[10px] cursor-pointer">
                    {language === 'ja' ? 'ミュート' : 'Mute'}
                </label>
            </div>
        </W95Border>
    );
};