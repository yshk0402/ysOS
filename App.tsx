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
import { useTheme } from './contexts/ThemeContext';
import { MacWindowFrame, MacDock, MacMenuBar } from './components/MacUI';

// --- Icons Constants ---
// Using absolute paths to ensure icons load correctly from the public root
// --- Icons Constants ---
const WIN95_ICONS = {
  MY_COMPUTER: '/icons/my_computer.png',
  DOCUMENTS: '/icons/documents.png',
  NETWORK: '/icons/network.png',
  RECYCLE_BIN: '/icons/recycle_bin.png',
  NOTEPAD: '/icons/notepad.png',
  SETTINGS: '/icons/settings.png',
  CALCULATOR: '/icons/settings.png', // Fallback
  YSCODE: '/icons/notepad.png' // Fallback
};

const MACOS_ICONS = {
  MY_COMPUTER: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Finder_Icon_macOS_Big_Sur.png/240px-Finder_Icon_macOS_Big_Sur.png',
  DOCUMENTS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/MacOS_Big_Sur_folder_icon.png/240px-MacOS_Big_Sur_folder_icon.png',
  NETWORK: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Terminal_icon_%28macOS_Big_Sur%29.svg/240px-Terminal_icon_%28macOS_Big_Sur%29.svg.png',
  RECYCLE_BIN: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Trash_Can_macOS_Big_Sur_icon.png/240px-Trash_Can_macOS_Big_Sur_icon.png',
  NOTEPAD: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Notes_icon_%28macOS_Big_Sur%29.svg/240px-Notes_icon_%28macOS_Big_Sur%29.svg.png',
  SETTINGS: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/System_Preferences_macOS_Big_Sur_icon.png/240px-System_Preferences_macOS_Big_Sur_icon.png',
  CALCULATOR: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Calculator_icon_%28macOS_Big_Sur%29.svg/240px-Calculator_icon_%28macOS_Big_Sur%29.svg.png',
  YSCODE: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/240px-Visual_Studio_Code_1.35_icon.svg.png'
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
  const { theme, toggleTheme } = useTheme();
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
      icon: WIN95_ICONS.MY_COMPUTER,
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
      icon: WIN95_ICONS.DOCUMENTS,
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
      icon: WIN95_ICONS.NETWORK,
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
      icon: WIN95_ICONS.NOTEPAD,
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
      icon: WIN95_ICONS.SETTINGS,
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
      icon: WIN95_ICONS.CALCULATOR,
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
      icon: WIN95_ICONS.YSCODE,
    }
  });

  // Update icons when theme changes
  useEffect(() => {
    const icons = theme === 'macos' ? MACOS_ICONS : WIN95_ICONS;
    setWindows(prev => {
      const newWindows = { ...prev };
      newWindows[AppId.MY_COMPUTER].icon = icons.MY_COMPUTER;
      newWindows[AppId.DOCUMENTS].icon = icons.DOCUMENTS;
      newWindows[AppId.NETWORK].icon = icons.NETWORK;
      newWindows[AppId.NOTEPAD].icon = icons.NOTEPAD;
      newWindows[AppId.SETTINGS].icon = icons.SETTINGS;
      newWindows[AppId.CALCULATOR].icon = icons.CALCULATOR;
      newWindows[AppId.YSCODE].icon = icons.YSCODE;
      return newWindows;
    });
  }, [theme]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>(AppId.MY_COMPUTER);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [draggingWindow, setDraggingWindow] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizingWindow, setResizingWindow] = useState<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
    direction: string;
  } | null>(null);
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
    const maxZ = Math.max(...Object.values(windows).map((w: WindowState) => w.zIndex));
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

  const handleResizeStart = (e: React.MouseEvent, id: string, direction: string) => {
    e.stopPropagation();
    const win = windows[id];
    setResizingWindow({
      id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: win.size.width,
      startHeight: win.size.height,
      startLeft: win.position.x,
      startTop: win.position.y,
      direction,
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
    } else if (resizingWindow) {
      const dx = e.clientX - resizingWindow.startX;
      const dy = e.clientY - resizingWindow.startY;
      const { id, startWidth, startHeight, startLeft, startTop, direction } = resizingWindow;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (direction.includes('e')) newWidth = Math.max(200, startWidth + dx);
      if (direction.includes('s')) newHeight = Math.max(150, startHeight + dy);
      if (direction.includes('w')) {
        newWidth = Math.max(200, startWidth - dx);
        if (newWidth > 200) newX = startLeft + dx;
        else newX = startLeft + (startWidth - 200);
      }
      if (direction.includes('n')) {
        newHeight = Math.max(150, startHeight - dy);
        if (newHeight > 150) newY = startTop + dy;
        else newY = startTop + (startHeight - 150);
      }

      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          position: { x: newX, y: newY },
          size: { width: newWidth, height: newHeight },
        },
      }));
    }
  }, [draggingWindow, resizingWindow]);

  const handleMouseUp = useCallback(() => {
    setDraggingWindow(null);
    setResizingWindow(null);
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

  const isMac = theme === 'macos';

  return (
    <div className={`w-full h-full overflow-hidden relative font-[Tahoma,sans-serif] select-none ${isMac ? 'bg-[url(https://4kwallpapers.com/images/wallpapers/macos-big-sur-apple-layers-fluidic-colorful-wwdc-2020-5120x2880-1455.jpg)] bg-cover bg-center font-sans' : 'bg-[#008080]'}`}>

      {/* Mac Menu Bar */}
      {isMac && <MacMenuBar activeApp={activeWindowId ? t(windows[activeWindowId].titleKey) : 'Finder'} date={new Date()} toggleTheme={toggleTheme} />}

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
      <div className={`absolute ${isMac ? 'top-10 right-4 flex-col items-end' : 'top-2 left-2 flex-col'} flex text-white`}>
        <DesktopIcon
          label={t('desktop.documents')}
          icon={isMac ? MACOS_ICONS.DOCUMENTS : WIN95_ICONS.DOCUMENTS}
          onClick={() => openWindow(AppId.DOCUMENTS)}
        />
        <DesktopIcon
          label={t('desktop.network')}
          icon={isMac ? MACOS_ICONS.NETWORK : WIN95_ICONS.NETWORK}
          onClick={() => openWindow(AppId.NETWORK)}
        />
        <DesktopIcon
          label={t('desktop.my_computer')}
          icon={isMac ? MACOS_ICONS.MY_COMPUTER : WIN95_ICONS.MY_COMPUTER}
          onClick={() => openWindow(AppId.MY_COMPUTER)}
        />
        <DesktopIcon
          label={t('desktop.recycle_bin')}
          icon={isMac ? MACOS_ICONS.RECYCLE_BIN : WIN95_ICONS.RECYCLE_BIN}
          onClick={() => { playSound('error'); alert("Recycle bin is empty."); }}
        />
        {isMac && (
          <DesktopIcon
            label="Switch to Win95"
            icon={MACOS_ICONS.SETTINGS}
            onClick={toggleTheme}
          />
        )}
        {!isMac && (
          <DesktopIcon
            label="Switch to Mac"
            icon={WIN95_ICONS.SETTINGS}
            onClick={toggleTheme}
          />
        )}
      </div>

      {/* Windows */}
      {Object.values(windows).map((win: WindowState) => (
        win.isOpen && (
          isMac ? (
            <MacWindowFrame
              key={win.id}
              window={win}
              isActive={activeWindowId === win.id}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onMouseDown={() => focusWindow(win.id)}
              onMoveStart={(e) => handleMouseDownWindow(e, win.id)}
              onResizeStart={(e, dir) => handleResizeStart(e, win.id, dir)}
              title={t(win.titleKey)}
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
            </MacWindowFrame>
          ) : (
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
        )
      ))}

      {/* Win95 Taskbar & Start Menu */}
      {!isMac && (
        <>
          {startMenuOpen && <StartMenu onClose={() => setStartMenuOpen(false)} onOpenWindow={openWindow} />}
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
              {Object.values(windows).filter((w: WindowState) => w.isOpen).map((win: WindowState) => (
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
        </>
      )}

      {/* Mac Dock */}
      {isMac && (
        <MacDock
          windows={windows}
          activeWindowId={activeWindowId}
          onAppClick={(id) => windows[id].isOpen ? focusWindow(id) : openWindow(id as AppId)}
        />
      )}
    </div>
  );
};

export default App;
