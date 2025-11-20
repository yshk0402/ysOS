import React from 'react';
import { ExplorerIcon } from '../components/SystemUI';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';

type ExplorerType = 'documents' | 'network';

interface Item {
    label: string;
    icon: string;
    action: () => void;
}

export const Explorer: React.FC<{ type: ExplorerType, icon?: string }> = ({ type, icon }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isMac = theme === 'macos';
    const openLink = (url: string) => window.open(url, '_blank');

    const documents: Item[] = [
        {
            label: 'BUMP',
            icon: isMac ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mac_OS_X_Lion_Launchpad_icon.png/240px-Mac_OS_X_Lion_Launchpad_icon.png' : '/icons/bump.svg',
            action: () => openLink('https://toolbox-seven-amber.vercel.app/')
        },
    ];

    const network: Item[] = [
        {
            label: 'GitHub',
            icon: isMac ? 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' : '/icons/github.png',
            action: () => openLink('https://github.com/yshk0402')
        },
        {
            label: 'X',
            icon: isMac ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/240px-X_logo_2023.svg.png' : '/icons/x.png',
            action: () => openLink('https://x.com/in_my_brain__')
        },
        {
            label: 'Email Me',
            icon: isMac ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Notes_icon_%28macOS_Big_Sur%29.svg/240px-Notes_icon_%28macOS_Big_Sur%29.svg.png' : '/icons/mail.png',
            action: () => openLink('mailto:y.sugar0402@gmail.com')
        },
    ];

    const items = type === 'documents' ? documents : network;

    // Use provided icon or fallbacks (using absolute paths)
    const currentIcon = icon || (type === 'documents'
        ? '/icons/documents.png'
        : '/icons/network.png');

    return (
        <div className={`flex flex-col h-full ${isMac ? 'bg-white' : 'bg-white'}`}>
            {isMac ? (
                <div className="flex items-center gap-4 p-3 border-b border-gray-200 bg-white text-sm">
                    <div className="flex gap-2 text-gray-400">
                        <ArrowLeft size={18} />
                        <ArrowRight size={18} />
                    </div>
                    <div className="font-bold text-gray-700 flex-1 text-center">
                        {type === 'documents' ? 'Documents' : 'Network'}
                    </div>
                    <div className="relative text-gray-400">
                        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2" />
                        <input className="bg-gray-100 rounded-md pl-7 pr-2 py-1 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-gray-300" placeholder="Search" />
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 p-2 border-b border-gray-300 bg-[#efefef] text-sm">
                    <span className="text-gray-500">{t('explorer.address')}</span>
                    <div className="bg-white border border-gray-400 px-2 py-0.5 w-full flex items-center gap-2">
                        <img
                            src={currentIcon}
                            className="w-4 h-4"
                            alt="icon"
                        />
                        <span>{type === 'documents' ? 'C:\\Users\\Guest\\Documents' : t('desktop.network')}</span>
                    </div>
                </div>
            )}
            <div className="flex-1 p-4 overflow-auto">
                <div className="flex flex-wrap content-start gap-4">
                    {items.map((item, idx) => (
                        <ExplorerIcon
                            key={idx}
                            label={item.label}
                            icon={item.icon}
                            onClick={item.action}
                        />
                    ))}
                </div>
            </div>
            {!isMac && (
                <div className="h-6 border-t border-gray-300 bg-[#efefef] flex items-center px-2 text-xs text-gray-600">
                    {items.length} {t('explorer.objects')}
                </div>
            )}
        </div>
    );
};
