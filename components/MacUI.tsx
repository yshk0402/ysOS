import React from 'react';
import { WindowState } from '../types';
import { X, Minus, Maximize2 } from 'lucide-react';

export const MacWindowFrame: React.FC<{
    window: WindowState;
    isActive: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    onMouseDown: () => void;
    onMoveStart: (e: React.MouseEvent) => void;
    onResizeStart: (e: React.MouseEvent, direction: string) => void;
    children: React.ReactNode;
    title: string;
}> = ({ window, isActive, onClose, onMinimize, onMaximize, onMouseDown, onMoveStart, onResizeStart, children, title }) => {
    if (window.isMinimized) return null;

    return (
        <div
            className={`absolute flex flex-col rounded-lg overflow-hidden shadow-2xl transition-shadow duration-200 ${isActive ? 'shadow-2xl ring-1 ring-black/10' : 'shadow-md opacity-90'}`}
            style={{
                left: window.position.x,
                top: window.position.y,
                width: window.size.width,
                height: window.size.height,
                zIndex: window.zIndex,
                backgroundColor: '#f5f5f5', // Light gray background
            }}
            onMouseDown={onMouseDown}
        >
            {/* Resize Handles */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute top-0 left-0 w-full h-2 cursor-n-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'n')} />
                <div className="absolute bottom-0 left-0 w-full h-2 cursor-s-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 's')} />
                <div className="absolute top-0 left-0 h-full w-2 cursor-w-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'w')} />
                <div className="absolute top-0 right-0 h-full w-2 cursor-e-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'e')} />

                <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'nw')} />
                <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'ne')} />
                <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'sw')} />
                <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto" onMouseDown={(e) => onResizeStart(e, 'se')} />
            </div>

            {/* Title Bar */}
            <div
                className="h-8 bg-gray-100/80 backdrop-blur-md border-b border-gray-300 flex items-center px-3 select-none"
                onMouseDown={onMoveStart}
            >
                <div className="flex gap-2 group">
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center hover:brightness-90">
                        <X size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24] flex items-center justify-center hover:brightness-90">
                        <Minus size={8} className="text-black/50 opacity-0 group-hover:opacity-100" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29] flex items-center justify-center hover:brightness-90">
                        <Maximize2 size={6} className="text-black/50 opacity-0 group-hover:opacity-100" />
                    </button>
                </div>
                <div className="flex-1 text-center text-sm font-medium text-gray-700">{title}</div>
                <div className="w-14"></div> {/* Spacer for centering */}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative bg-white">
                {children}
            </div>
        </div>
    );
};

export const MacDock: React.FC<{
    windows: Record<string, WindowState>;
    activeWindowId: string | null;
    onAppClick: (id: string) => void;
}> = ({ windows, activeWindowId, onAppClick }) => {
    return (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 h-16 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center gap-2 px-4 shadow-2xl z-[10000]">
            {Object.values(windows).map((win: WindowState) => (
                <div
                    key={win.id}
                    className="relative group flex flex-col items-center justify-center w-12 h-12 transition-all duration-200 hover:-translate-y-2 hover:scale-110 cursor-pointer"
                    onClick={() => onAppClick(win.id)}
                >
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
                        {typeof win.icon === 'string' ? <img src={win.icon} alt={win.titleKey} className="w-full h-full object-cover" /> : win.icon}
                    </div>
                    {win.isOpen && (
                        <div className="absolute -bottom-1 w-1 h-1 bg-black rounded-full opacity-50"></div>
                    )}
                    <div className="absolute -top-8 bg-gray-800/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm">
                        {win.titleKey}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const MacMenuBar: React.FC<{
    activeApp: string;
    date: Date;
    toggleTheme: () => void;
}> = ({ activeApp, date, toggleTheme }) => {
    return (
        <div className="h-7 bg-white/50 backdrop-blur-md flex items-center px-4 justify-between text-sm font-medium shadow-sm z-[10000] select-none">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg"></span>
                <span className="font-bold">{activeApp}</span>
                <span className="hidden sm:block">File</span>
                <span className="hidden sm:block">Edit</span>
                <span className="hidden sm:block">View</span>
                <span className="hidden sm:block">Window</span>
                <span className="hidden sm:block">Help</span>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300 transition-colors">
                    Switch to Win95
                </button>
                <span>{date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
        </div>
    )
}
