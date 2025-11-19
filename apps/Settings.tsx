import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

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