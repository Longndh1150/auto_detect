"use client";

import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Chat } from '../components/Chat';
import { InputBox } from '../components/InputBox';

export default function Home() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 relative h-full">
        <Chat />
        <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-2">
          <InputBox />
          <div className="text-center text-xs text-gray-500 py-2">
            AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}
