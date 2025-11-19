import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'ja';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

const translations: Translations = {
    en: {
        'desktop.my_computer': 'My Computer',
        'desktop.documents': 'My Documents',
        'desktop.network': 'Network Neighborhood',
        'desktop.recycle_bin': 'Recycle Bin',
        'desktop.gemini': 'Gemini Chat',
        'start.programs': 'Programs',
        'start.documents': 'Documents',
        'start.settings': 'Settings',
        'start.find': 'Find',
        'start.shutdown': 'Shut Down...',
        'app.notepad': 'Notepad',
        'app.settings': 'Control Panel',
        'app.gemini': 'Gemini Assistant',
        'settings.language': 'Language / 言語',
        'settings.select': 'Select System Language:',
        'notepad.welcome': 'Welcome to Windows 95 React Edition.\n\nFeel free to edit this text.',
        'menu.file': 'File',
        'menu.edit': 'Edit',
        'menu.search': 'Search',
        'menu.view': 'View',
        'menu.help': 'Help',
        'gemini.welcome': 'Greetings. I am the Gemini Assistant for Windows 95. How may I assist you today?',
        'gemini.thinking': 'Thinking...',
        'gemini.send': 'Send',
        'gemini.placeholder': 'Type a message...',
        'gemini.error': 'Error connecting to service.',
        'profile.user': 'Owner',
        'profile.contact': 'Contact Me',
        'profile.sys_prop': 'System Properties',
        'profile.role': 'Role:',
        'profile.location': 'Location:',
        'profile.computer': 'Computer:',
        'profile.language': 'Language:',
        'profile.memory': 'Memory:',
        'profile.system': 'System:',
        'profile.bio': 'Bio',
        'profile.bio_text': 'Welcome to my digital workspace. I build modern web applications with a touch of nostalgia. Feel free to explore {documents} to see my projects or check {network} to connect with me on social media.',
        'explorer.address': 'Address:',
        'explorer.objects': 'object(s)',
        'explorer.access_denied': 'Access Denied.',
        'desktop.recycle_empty': 'Recycle bin is empty.',
        'alert.welcome_title': 'Welcome to Windows 95',
        'alert.welcome_msg': 'Welcome to my Playgrounds. \n\nMy New App,BUMP,is now available。Check it out in My Documents.',
        'button.ok': 'OK',
    },
    ja: {
        'desktop.my_computer': 'マイ コンピュータ',
        'desktop.documents': 'マイドキュメント',
        'desktop.network': 'ネットワーク コンピュータ',
        'desktop.recycle_bin': 'ごみ箱',
        'desktop.gemini': 'Geminiチャット',
        'start.programs': 'プログラム',
        'start.documents': 'ドキュメント',
        'start.settings': '設定',
        'start.find': '検索',
        'start.shutdown': 'Windowsの終了...',
        'app.notepad': 'メモ帳',
        'app.settings': 'コントロール パネル',
        'app.gemini': 'Geminiアシスタント',
        'settings.language': '言語 / Language',
        'settings.select': 'システム言語を選択:',
        'notepad.welcome': 'Windows 95 React Editionへようこそ。\n\nこのテキストは自由に編集できます。',
        'menu.file': 'ファイル',
        'menu.edit': '編集',
        'menu.search': '検索',
        'menu.view': '表示',
        'menu.help': 'ヘルプ',
        'gemini.welcome': 'こんにちは。Windows 95用のGeminiアシスタントです。何かお手伝いしましょうか？',
        'gemini.thinking': '思考中...',
        'gemini.send': '送信',
        'gemini.placeholder': 'メッセージを入力...',
        'gemini.error': 'サービス接続エラー。',
        'profile.user': 'オーナー',
        'profile.contact': '連絡する',
        'profile.sys_prop': 'システムのプロパティ',
        'profile.role': '役割:',
        'profile.location': '場所:',
        'profile.computer': 'コンピュータ:',
        'profile.language': '言語:',
        'profile.memory': 'メモリ:',
        'profile.system': 'システム:',
        'profile.bio': '自己紹介',
        'profile.bio_text': '私のデジタルワークスペースへようこそ。懐かしさを感じるモダンなWebアプリを作っています。{documents} でプロジェクトを見たり、{network} でSNSを確認してください。',
        'explorer.address': 'アドレス:',
        'explorer.objects': '個のオブジェクト',
        'explorer.access_denied': 'アクセスが拒否されました。',
        'desktop.recycle_empty': 'ごみ箱は空です。',
        'alert.welcome_title': 'Windows 95へようこそ',
        'alert.welcome_msg': '私のPlaygroundへようこそ。\n\n新アプリ、BUMPが公開中です。マイドキュメントから確認してください。',
        'button.ok': 'OK',
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const stored = window.localStorage.getItem('language');
            if (stored === 'en' || stored === 'ja') {
                return stored;
            }
        }
        return 'en';
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('language', language);
        }
    }, [language]);

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
