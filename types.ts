import React from 'react';

export enum AppId {
  MY_COMPUTER = 'my_computer',
  DOCUMENTS = 'documents',
  NETWORK = 'network',
  NOTEPAD = 'notepad',
  SETTINGS = 'settings',
  CALCULATOR = 'calculator',
  YSCODE = 'yscode',
}

export interface WindowState {
  id: AppId;
  titleKey: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  icon: React.ReactNode;
}

export interface DesktopIconProps {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  onOpen: (id: AppId) => void;
}

export interface WindowProps {
  state: WindowState;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onMaximize: (id: AppId) => void;
  onFocus: (id: AppId) => void;
  onMove: (id: AppId, x: number, y: number) => void;
  children: React.ReactNode;
}
