import React from 'react';
import { ExplorerIcon } from '../components/SystemUI';
import { useLanguage } from '../contexts/LanguageContext';

type ExplorerType = 'documents' | 'network';

interface Item {
    label: string;
    icon: string;
    action: () => void;
}

export const Explorer: React.FC<{ type: ExplorerType, icon?: string }> = ({ type, icon }) => {
    const { t } = useLanguage();
    const openLink = (url: string) => window.open(url, '_blank');

    const documents: Item[] = [
        { 
            label: 'BUMP', 
            icon: '/icons/bump.svg', 
            action: () => openLink('https://toolbox-seven-amber.vercel.app/') 
        },
    /*
        { 
            label: 'Project_A.exe', 
            icon: '/icons/program.png', 
            action: () => alert('Launching Project A (Demo Mode)...') 
        },
        { 
            label: 'Resume.doc', 
            icon: '/icons/document.png', 
            action: () => alert('Opening Resume...') 
        },
        { 
            label: 'Notes.txt', 
            icon: '/icons/text.png', 
            action: () => alert('Just some random notes.') 
        },
         { 
            label: 'Images', 
            icon: '/icons/folder.png', 
            action: () => alert(t('explorer.access_denied')) 
        },
        */
    ];

    const network: Item[] = [
        { 
            label: 'GitHub', 
            icon: '/icons/github.png', 
            action: () => openLink('https://github.com/yshk0402') 
        },
        { 
            label: 'X', 
            icon: '/icons/x.png', 
            action: () => openLink('https://x.com/in_my_brain__') 
        },
        { 
            label: 'Email Me', 
            icon: '/icons/mail.png', 
            action: () => openLink('mailto:y.sugar0402@gmail.com') 
        },
    ];

    const items = type === 'documents' ? documents : network;
    
    // Use provided icon or fallbacks (using absolute paths)
    const currentIcon = icon || (type === 'documents' 
        ? '/icons/documents.png' 
        : '/icons/network.png');

    return (
        <div className="flex flex-col h-full bg-white">
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
            <div className="flex-1 p-2 overflow-auto">
                <div className="flex flex-wrap content-start gap-2">
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
            <div className="h-6 border-t border-gray-300 bg-[#efefef] flex items-center px-2 text-xs text-gray-600">
                {items.length} {t('explorer.objects')}
            </div>
        </div>
    );
};
