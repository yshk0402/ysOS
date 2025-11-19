import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppId, WindowState } from './types';
import { Button95, DesktopIcon, W95Border } from './components/SystemUI';
import { Notepad } from './apps/Notepad';
import { Profile } from './apps/Profile';
import { Explorer } from './apps/Explorer';
import { Settings } from './apps/Settings';
import { Calculator } from './apps/Calculator';
import { YScode } from './apps/YScode';
import { VolumePopup } from './components/VolumePopup';
import { Minus, Square, X, ExternalLink, FileText, Monitor, Cpu, LogOut, Volume2, ChevronRight } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { useSound } from './contexts/SoundContext';

// --- Icons Constants ---
// Using absolute paths to ensure icons load correctly from the public root
const ICONS = {
  MY_COMPUTER: '/icons/my_computer.png',
  DOCUMENTS: '/icons/documents.png',
  NETWORK: '/icons/network.png',
  RECYCLE_BIN: '/icons/recycle_bin.png',
  NOTEPAD: '/icons/notepad.png',
  SETTINGS: '/icons/settings.png',
  CALCULATOR: '/icons/settings.png',
  YSCODE: '/icons/notepad.png'
};

// --- Sub-components ---

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="tect-xs select-none px-1">
      {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
    </span>
  );
};

const StartMenu: React.FC<{ onClose: () => void; onOpenWindow: (id: AppId) => void }> = ({ onClose, onOpenWindow }) => {
  const { t } = useLanguage();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleClick = (id?: AppId) => {
    if (id) onOpenWindow(id);
    onClose();
  };
  return (
    <div className="absolute bottom-8 left-0 w-48 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-xl z-[9999]">
      <div className="flex h-full">
        <div className="w-8 bg-[#000080] flex items-end pb-2 justify-center relative">
          <span className="text-white font-bold text-xl -rotate-90 whitespace-nowrap tracking-widest absolute bottom-10 origin-bottom-left left-8">
            WINDOWS<span className="font-normal ml-2">95</span>
          </span>
        </div>
        <div className="flex-1 flex flex-col p-1 gap-1">
          <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer group">
            <span className="w-6 flex justify-center"><ExternalLink size={16} /></span>
            <span className="text-sm">{t('start.programs')}</span>
            <div className="ml-auto">▶</div>
          </div>
          <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={() => handleClick(AppId.DOCUMENTS)}>
            <span className="w-6 flex justify-center"><FileText size={16} /></span>
            <span className="text-sm">{t('start.documents')}</span>
            <div className="ml-auto">▶</div>
          </div>
          <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={() => handleClick(AppId.SETTINGS)}>
            <span className="w-6 flex justify-center"><Monitor size={16} /></span>
            <span className="text-sm">{t('start.settings')}</span>
            <div className="ml-auto">▶</div>
          </div>
          <div
            className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer relative group"
            onMouseEnter={() => setActiveSubmenu('find')}
            onMouseLeave={() => setActiveSubmenu(null)}
          >
            <span className="w-6 flex justify-center"><Cpu size={16} /></span>
            <span className="text-sm">{t('start.find')}</span>
            <div className="ml-auto"><ChevronRight size={16} /></div>

            {activeSubmenu === 'find' && (
              <div className="absolute left-full top-0 w-48 bg-[#c0c0c0] border-2 border-white border-r-black border-b-black shadow-xl ml-[-2px]">
                <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleClick(AppId.NOTEPAD); }}>
                  <span className="w-6 flex justify-center"><FileText size={16} /></span>
                  <span className="text-sm">Notepad</span>
                </div>
                <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleClick(AppId.CALCULATOR); }}>
                  <span className="w-6 flex justify-center"><Cpu size={16} /></span>
                  <span className="text-sm">Calculator</span>
                </div>
                <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleClick(AppId.YSCODE); }}>
                  <span className="w-6 flex justify-center"><Monitor size={16} /></span>
                  <span className="text-sm">YScode</span>
                </div>
              </div>
            )}
          </div>
          <div className="h-[1px] bg-gray-500 border-b border-white my-1"></div>
          <div className="hover:bg-[#000080] hover:text-white p-1 flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <span className="w-6 flex justify-center"><LogOut size={16} /></span>
            <span className="text-sm">{t('start.shutdown')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WindowFrame: React.FC<{
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMouseDown: () => void;
  onMoveStart: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}> = ({ window, isActive, onClose, onMinimize, onMaximize, onMouseDown, onMoveStart, children }) => {
  const { t } = useLanguage();
  if (window.isMinimized) return null;

  return (
    <div
      className="absolute flex flex-col bg-[#c0c0c0]"
      style={{
        left: window.position.x,
        top: window.position.y,
        width: window.size.width,
        height: window.size.height,
        zIndex: window.zIndex,
        boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
      }}
      onMouseDown={onMouseDown}
    >
      <div className="absolute inset-0 pointer-events-none border-2 border-t-white border-l-white border-r-black border-b-black"></div>
      <div className="absolute inset-[2px] pointer-events-none border border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#808080] border-b-[#808080]"></div>

      <div
        className={`m-[3px] px-1 h-[20px] flex items-center justify-between select-none ${isActive ? 'bg-[#000080]' : 'bg-[#808080]'}`}
        onMouseDown={onMoveStart}
      >
        <div className="flex items-center gap-1 text-white font-bold text-sm tracking-wide">
          <img src={window.icon as string} className="w-4 h-4" alt="icon" />
          {t(window.titleKey)}
        </div>
        <div className="flex gap-[2px]">
          <Button95 className="!w-[18px] !h-[16px] !p-0 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
            <Minus size={10} strokeWidth={4} />
          </Button95>
          <Button95 className="!w-[18px] !h-[16px] !p-0 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onMaximize(); }}>
            <Square size={10} strokeWidth={3} />
          </Button95>
          <Button95 className="!w-[18px] !h-[16px] !p-0 flex items-center justify-center ml-1" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            <X size={12} strokeWidth={4} />
          </Button95>
        </div>
      </div>

      <div className="flex-1 m-[3px] mt-0 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const { t } = useLanguage();
  const { playSound } = useSound();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [windows, setWindows] = useState<Record<string, WindowState>>({
    [AppId.MY_COMPUTER]: {
      id: AppId.MY_COMPUTER,
      titleKey: 'desktop.my_computer',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      position: { x: 50, y: 50 },
      size: { width: 450, height: 350 },
      icon: ICONS.MY_COMPUTER,
    },
    [AppId.DOCUMENTS]: {
      id: AppId.DOCUMENTS,
      titleKey: 'desktop.documents',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 5,
      position: { x: 80, y: 80 },
      size: { width: 500, height: 400 },
      icon: ICONS.DOCUMENTS,
    },
    [AppId.NETWORK]: {
      id: AppId.NETWORK,
      titleKey: 'desktop.network',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 6,
      position: { x: 110, y: 110 },
      size: { width: 400, height: 300 },
      icon: ICONS.NETWORK,
    },
    [AppId.NOTEPAD]: {
      id: AppId.NOTEPAD,
      titleKey: 'app.notepad',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 3,
      position: { x: 150, y: 150 },
      size: { width: 400, height: 300 },
      icon: ICONS.NOTEPAD,
    },
    [AppId.SETTINGS]: {
      id: AppId.SETTINGS,
      titleKey: 'app.settings',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 7,
      position: { x: 200, y: 120 },
      size: { width: 360, height: 280 },
      icon: ICONS.SETTINGS,
    },
    [AppId.CALCULATOR]: {
      id: AppId.CALCULATOR,
      titleKey: 'Calculator',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 8,
      position: { x: 250, y: 150 },
      size: { width: 250, height: 350 },
      icon: ICONS.CALCULATOR,
    },
    [AppId.YSCODE]: {
      id: AppId.YSCODE,
      titleKey: 'YScode',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 9,
      position: { x: 100, y: 50 },
      size: { width: 800, height: 600 },
      icon: ICONS.YSCODE,
    }
  });

  const [activeWindowId, setActiveWindowId] = useState<string | null>(AppId.MY_COMPUTER);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    playSound('startup');
  }
  const openWindow = (id: AppId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: getNextZIndex() },
    }));
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    playSound('close');
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
    setActiveWindowId(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) => {
      const wasMinimized = prev[id].isMinimized;
      return {
        ...prev,
        [id]: { ...prev[id], isMinimized: !wasMinimized, zIndex: !wasMinimized ? prev[id].zIndex : getNextZIndex() },
      }
    });
    if (windows[id].isMinimized) {
      setActiveWindowId(id);
    }
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position: prev[id].isMaximized ? { x: 50, y: 50 } : { x: 0, y: 0 },
        size: prev[id].isMaximized ? { width: 450, height: 350 } : { width: window.innerWidth, height: window.innerHeight - 28 },
        isMaximized: !prev[id].isMaximized
      }
    }))
  };

  const focusWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], zIndex: getNextZIndex() },
    }));
    setActiveWindowId(id);
    setStartMenuOpen(false);
  };

  const getNextZIndex = () => {
    const maxZ = Math.max(...Object.values(windows).map((w) => w.zIndex));
    return maxZ + 1;
  };

  const handleMouseDownWindow = (e: React.MouseEvent, id: string) => {
    if (windows[id].isMaximized) return;

    const win = windows[id];
    setDraggingWindow({
      id,
      offsetX: e.clientX - win.position.x,
      offsetY: e.clientY - win.position.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (draggingWindow) {
      setWindows((prev) => ({
        ...prev,
        [draggingWindow.id]: {
          ...prev[draggingWindow.id],
          position: {
            x: e.clientX - draggingWindow.offsetX,
            y: e.clientY - draggingWindow.offsetY,
          },
        },
      }));
    }
  }, [draggingWindow]);

  const handleMouseUp = useCallback(() => {
    setDraggingWindow(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Click outside to close volume popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
        setShowVolume(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full bg-[#008080] overflow-hidden relative font-[Tahoma,sans-serif] select-none">
      {/* Welcome Alert Modal */}
      {showWelcome && (
        <div className="absolute inset-0 z-[50000] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
          <W95Border className="w-[350px] flex flex-col p-1 bg-[#c0c0c0] shadow-xl">
            <div className="bg-[#000080] text-white px-2 py-1 font-bold flex justify-between items-center mb-1">
              <span className="text-sm">{t('alert.welcome_title')}</span>
              <Button95
                onClick={handleWelcomeClose}
                className="!w-[16px] !h-[14px] !p-0 flex items-center justify-center"
              >
                <X size={10} strokeWidth={4} />
              </Button95>
            </div>
            <div className="p-4 flex items-start gap-4">
              <img src="https://win98icons.alexmeub.com/icons/png/msg_information-0.png" className="w-8 h-8" alt="info" />
              <div className="text-sm leading-relaxed">
                {t('alert.welcome_msg')}
              </div>
            </div>
            <div className="flex justify-center p-2 pt-4">
              <Button95 onClick={handleWelcomeClose} className="w-20 font-bold">{t('button.ok')}</Button95>
            </div>
          </W95Border>
        </div>
      )}
      {/* Desktop Icons */}
      <div className="absolute top-2 left-2 flex flex-col text-white">
        <DesktopIcon
          label={t('desktop.documents')}
          icon={ICONS.DOCUMENTS}
          onClick={() => openWindow(AppId.DOCUMENTS)}
        />
        <DesktopIcon
          label={t('desktop.network')}
          icon={ICONS.NETWORK}
          onClick={() => openWindow(AppId.NETWORK)}
        />
        <DesktopIcon
          label={t('desktop.my_computer')}
          icon={ICONS.MY_COMPUTER}
          onClick={() => openWindow(AppId.MY_COMPUTER)}
        />
        <DesktopIcon
          label={t('desktop.recycle_bin')}
          icon={ICONS.RECYCLE_BIN}
          onClick={() => { playSound('error'); alert("Recycle bin is empty."); }}
        />
      </div>

      {/* Windows */}
      {Object.values(windows).map((win: WindowState) => (
        win.isOpen && (
          <WindowFrame
            key={win.id}
            window={win}
            isActive={activeWindowId === win.id}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() => maximizeWindow(win.id)}
            onMouseDown={() => focusWindow(win.id)}
            onMoveStart={(e) => handleMouseDownWindow(e, win.id)}
          >
            {win.id === AppId.MY_COMPUTER && (
              <Profile
                onOpenDocuments={() => openWindow(AppId.DOCUMENTS)}
                onOpenNetwork={() => openWindow(AppId.NETWORK)}
                onOpenContact={() => openWindow(AppId.NETWORK)}
              />
            )}
            {win.id === AppId.DOCUMENTS && <Explorer type="documents" icon={win.icon as string} />}
            {win.id === AppId.NETWORK && <Explorer type="network" icon={win.icon as string} />}
            {win.id === AppId.NOTEPAD && <Notepad />}
            {win.id === AppId.SETTINGS && <Settings />}
            {win.id === AppId.CALCULATOR && <Calculator />}
            {win.id === AppId.YSCODE && <YScode />}
          </WindowFrame>
        )
      ))}

      {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} onOpenWindow={openWindow} />}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-[28px] bg-[#c0c0c0] border-t-white border-t-2 flex items-center px-1 z-[10000]">
        <Button95
          active={startMenuOpen}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          className="font-bold italic mr-2 py-0.5 px-2 flex items-center"
        >
          <img src="/icons/windows.png" className="w-4 h-4 mr-1" alt="logo" />
          Start
        </Button95>

        <div className="flex-1 flex gap-1 overflow-hidden px-1">
          {Object.values(windows).filter(w => w.isOpen).map(win => (
            <Button95
              key={win.id}
              active={activeWindowId === win.id && !win.isMinimized}
              onClick={() => win.isMinimized || activeWindowId !== win.id ? focusWindow(win.id) : toggleMinimize(win.id)}
              className="flex-1 max-w-[160px] text-left justify-start truncate px-1 py-0.5"
            >
              <img src={win.icon as string} className="w-4 h-4 mr-1 inline" alt="" />
              <span className="truncate text-xs">{t(win.titleKey)}</span>
            </Button95>
          ))}
        </div>

        <div className="w-[2px] h-[20px] border-l border-gray-500 border-r border-white mx-1"></div>
        {/* Tray Area */}
        <div className="flex items-center pl-2 pr-1 h-[22px] bg-[#c0c0c0] border-t-gray-500 border-l-gray-500 border-r-white border-b-white border text-xs select-none gap-2 relative" ref={volumeRef}>

          {showVolume && <VolumePopup onClose={() => setShowVolume(false)} />}

          <div
            className="hover:bg-gray-300 cursor-pointer p-[1px]"
            onClick={() => setShowVolume(!showVolume)}
          >
            <img
              src="https://win98icons.alexmeub.com/icons/png/loudspeaker_rays-0.png"
              className="w-4 h-4"
              alt="sound"
            />
          </div>
          <Clock />
        </div>
      </div>
    </div>
  );
};

export default App;
