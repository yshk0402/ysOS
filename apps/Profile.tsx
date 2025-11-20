import React from 'react';
import { Button95 } from '../components/SystemUI';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileProps {
    onOpenDocuments: () => void;
    onOpenNetwork: () => void;
    onOpenContact: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onOpenDocuments, onOpenNetwork, onOpenContact }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isMac = theme === 'macos';

    const renderBioContent = () => {
        const raw = t('profile.bio_text');
        const tokens = raw.split(/(\{documents\}|\{network\})/g);
        return tokens.map((token, idx) => {
            if (token === '{documents}') {
                return (
                    <button
                        key={`doc-${idx}`}
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={onOpenDocuments}
                    >
                        {t('desktop.documents')}
                    </button>
                );
            }
            if (token === '{network}') {
                return (
                    <button
                        key={`network-${idx}`}
                        type="button"
                        className="text-blue-600 hover:underline"
                        onClick={onOpenNetwork}
                    >
                        {t('desktop.network')}
                    </button>
                );
            }
            return <React.Fragment key={`text-${idx}`}>{token}</React.Fragment>;
        });
    };

    if (isMac) {
        return (
            <div className="flex flex-col h-full bg-gray-50 p-6 text-sm font-sans">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg mb-4">
                        <img
                            src="/icons/user.png"
                            alt={t('profile.user')}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="font-bold text-2xl text-gray-800">YSato</h2>
                    <p className="text-gray-500">SoloDev</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
                        <div className="text-gray-500 font-medium text-right pr-4">{t('profile.location')}</div>
                        <div className="text-gray-800">Japan, Tokyo</div>
                        <div className="text-gray-500 font-medium text-right pr-4">{t('profile.computer')}</div>
                        <div className="text-gray-800">MacBook Pro (M3 Max)</div>
                        <div className="text-gray-500 font-medium text-right pr-4">{t('profile.language')}</div>
                        <div className="text-gray-800">Japanese / English</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-1 overflow-auto">
                    <h3 className="font-bold text-gray-800 mb-2">{t('profile.bio')}</h3>
                    <p className="text-gray-600 leading-relaxed">
                        {renderBioContent()}
                    </p>
                </div>
                <div className="mt-4 flex justify-center">
                    <Button95 onClick={onOpenContact} className="w-full max-w-xs">{t('profile.contact')}</Button95>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] p-2 text-sm">
            <div className="bg-white border border-gray-400 p-4 flex gap-6 h-full shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col items-center gap-4 w-1/3 border-r border-gray-200 pr-4">
                    <div className="w-24 h-24 bg-gray-200 border-2 border-gray-400 flex items-center justify-center">
                        <img
                            src="/icons/user.png"
                            alt={t('profile.user')}
                            className="w-16 h-16 pixelated"
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="font-bold text-lg">YSato</h2>
                        <p className="text-gray-500 text-xs">{t('profile.user')}</p>
                    </div>
                    <Button95 className="w-full" onClick={onOpenContact}>{t('profile.contact')}</Button95>
                </div>

                <div className="flex-1 flex flex-col gap-4 overflow-auto">
                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-2">{t('profile.sys_prop')}</h3>
                        <div className="grid grid-cols-[80px_1fr] gap-y-1 text-xs">
                            <div className="font-bold">{t('profile.role')}</div>
                            <div>SoloDev</div>
                            <div className="font-bold">{t('profile.location')}</div>
                            <div>Japan,Tokyo</div>
                            <div className="font-bold">{t('profile.computer')}</div>
                            <div>YS2002 Edition, Build 04.02</div>
                            <div className="font-bold">{t('profile.language')}</div>
                            <div>Japanese/English</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold border-b border-gray-300 mb-2">{t('profile.bio')}</h3>
                        <p className="text-xs leading-relaxed">
                            {renderBioContent()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
