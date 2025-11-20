import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Globe } from 'lucide-react';

export const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const { theme } = useTheme();
    const isMac = theme === 'macos';

    if (isMac) {
        return (
            <div className="flex flex-col h-full bg-[#f5f5f7] text-[#1d1d1f] font-sans">
                <div className="p-6 flex flex-col items-center border-b border-gray-200 bg-white">
                    <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-md mb-3">
                        <Globe size={32} />
                    </div>
                    <h2 className="text-xl font-semibold">{t('settings.language')}</h2>
                    <p className="text-sm text-gray-500 mt-1">Language & Region</p>
                </div>

                <div className="p-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-3 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setLanguage('en')}>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                                    {language === 'en' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                </div>
                                <span className="font-medium">English</span>
                            </div>
                            {language === 'en' && <span className="text-blue-500 text-sm font-medium">Default</span>}
                        </div>
                        <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50" onClick={() => setLanguage('ja')}>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                                    {language === 'ja' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                                </div>
                                <span className="font-medium">日本語 (Japanese)</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-500">
                        {language === 'en' ? 'Changes are applied immediately.' : '変更はすぐに反映されます。'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] p-2 text-sm">
            <div className="bg-[#c0c0c0] p-4">
                <fieldset className="border-2 border-white border-r-gray-500 border-b-gray-500 p-4">
                    <legend className="px-2 ml-2">{t('settings.language')}</legend>

                    <div className="mb-4">{t('settings.select')}</div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="language"
                                checked={language === 'en'}
                                onChange={() => setLanguage('en')}
                                className="w-4 h-4"
                            />
                            <span>English</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="language"
                                checked={language === 'ja'}
                                onChange={() => setLanguage('ja')}
                                className="w-4 h-4"
                            />
                            <span>日本語 (Japanese)</span>
                        </label>
                    </div>
                </fieldset>

                <div className="mt-6 text-center text-xs text-gray-600">
                    {language === 'en' ? 'Changes are applied immediately.' : '変更はすぐに反映されます。'}
                </div>
            </div>
        </div>
    );
};