import React, { useState, useEffect, useRef } from 'react';
import { Button95, Input95, ScrollPanel, W95Border } from '../components/SystemUI';
import { sendMessageToGemini } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const GeminiChat: React.FC = () => {
    const { t } = useLanguage();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: t('gemini.welcome') }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const menuItems = ['menu.file', 'menu.edit', 'menu.view', 'menu.help'] as const;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const responseText = await sendMessageToGemini(input, history);
            
            setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: t('gemini.error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-1 gap-1 bg-[#c0c0c0]">
            <div className="shrink-0 mb-1">
                <div className="text-sm mb-1">
                    {menuItems.map((key) => (
                        <span key={key} className="mr-2">{t(key)}</span>
                    ))}
                </div>
                <div className="h-[1px] bg-white shadow-[0_1px_0_#808080]"></div>
            </div>

            <ScrollPanel className="flex-1 p-2 font-sans text-sm">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-blue-800 font-bold' : 'text-black'}`}>
                        <span className="uppercase text-xs mr-1 mb-1 block text-[#808080]">
                            {msg.role === 'user' ? 'You' : 'Gemini'}:
                        </span>
                        <span className="whitespace-pre-wrap">{msg.text}</span>
                    </div>
                ))}
                {isLoading && <div className="text-[#808080] italic">{t('gemini.thinking')}</div>}
                <div ref={bottomRef} />
            </ScrollPanel>

            <W95Border type="in" className="p-1 bg-[#c0c0c0]">
                <div className="flex gap-2">
                    <Input95 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('gemini.placeholder')}
                        disabled={isLoading}
                        autoFocus
                    />
                    <Button95 onClick={handleSend} disabled={isLoading} className="w-20 font-bold">
                        {t('gemini.send')}
                    </Button95>
                </div>
            </W95Border>
        </div>
    );
};
