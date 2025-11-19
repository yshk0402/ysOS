import React from 'react';
import { useSound } from '../contexts/SoundContext';

export const W95Border: React.FC<{ children: React.ReactNode, className?: string, type?: 'out' | 'in' }> = ({ children, className = '', type = 'out' }) => {
    const borderStyles = type === 'out' 
        ? "border-t-white border-l-white border-r-black border-b-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1),inset_1px_1px_0px_0px_rgba(223,223,223,1)]"
        : "border-t-black border-l-black border-r-white border-b-white shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,1),1px_1px_0px_0px_rgba(255,255,255,1)]";

    return (
        <div className={`bg-[#c0c0c0] border-2 ${borderStyles} ${className}`}>
            {children}
        </div>
    );
};

export const Button95: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean, icon?: React.ReactNode }> = ({ children, className, active, icon, ...props }) => {
    const { playSound } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playSound('click');
        if (onClick) onClick(e);
    };

    return (
        <button 
            className={`
                flex items-center justify-center gap-2 px-2 py-1 text-sm active:border-t-black active:border-l-black active:border-r-white active:border-b-white active:translate-y-[1px]
                ${active ? 'border-t-black border-l-black border-r-white border-b-white bg-[url(https://cdn.pixabay.com/photo/2014/05/03/00/39/pattern-336285_1280.png)]' : 'border-t-white border-l-white border-r-black border-b-black'}
                border-2 bg-[#c0c0c0] focus:outline-[1px] focus:outline-black focus:outline-dashed focus:outline-offset-[-4px]
                ${className || ''}
            `}
            onClick={handleClick}
            {...props}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
};

export const Input95: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
    return (
        <input 
            {...props}
            className={`w-full h-full px-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white outline-none ${props.className || ''}`}
        />
    )
}

export const ScrollPanel: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
    return (
        <div className={`bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white overflow-auto ${className}`}>
            {children}
        </div>
    )
}

export const DesktopIcon: React.FC<{ label: string; icon: string; onClick: () => void }> = ({ label, icon, onClick }) => (
    <div 
        className="w-20 flex flex-col items-center gap-1 cursor-pointer group mb-6"
        onDoubleClick={onClick}
    >
        <img src={icon} alt={label} className="w-10 h-10 pixelated group-active:opacity-50" />
        <span className="text-white text-xs text-center px-1 group-hover:bg-[#000080] border border-transparent group-focus:border-dotted group-focus:border-white line-clamp-2 break-words shadow-sm">
            {label}
        </span>
    </div>
);

export const ExplorerIcon: React.FC<{ label: string; icon: string; onClick: () => void }> = ({ label, icon, onClick }) => (
    <div 
        className="w-20 flex flex-col items-center gap-1 cursor-pointer group p-2 hover:border hover:border-gray-200 hover:bg-gray-100 active:bg-blue-900 active:text-white"
        onDoubleClick={onClick}
    >
        <img src={icon} alt={label} className="w-10 h-10 pixelated" />
        <span className="text-xs text-center break-words w-full line-clamp-2 group-active:text-white">
            {label}
        </span>
    </div>
);