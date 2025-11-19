import React, { useState } from 'react';
import { ScrollPanel } from '../components/SystemUI';
import { useLanguage } from '../contexts/LanguageContext';

export const Notepad: React.FC = () => {
    const { t } = useLanguage();
    const [text, setText] = useState(t('notepad.welcome'));
    const menuItems = ['menu.file', 'menu.edit', 'menu.search', 'menu.view', 'menu.help'] as const;

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0]">
             <div className="shrink-0 px-1 py-0.5">
                <div className="text-sm flex gap-3">
                    {menuItems.map((key) => (
                        <span key={key} className="underline decoration-dotted underline-offset-4">{t(key)}</span>
                    ))}
                </div>
            </div>
            <div className="flex-1 p-0.5 border-t-white border-t border-l-white border-l border-r-gray-500 border-r border-b-gray-500 border-b">
                 <textarea 
                    className="w-full h-full resize-none outline-none p-1 font-mono text-sm bg-white overflow-auto"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    spellCheck={false}
                 />
            </div>
        </div>
    );
};
