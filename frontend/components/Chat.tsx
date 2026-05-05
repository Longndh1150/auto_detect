import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { Message } from './Message';

export const Chat = () => {
  const messages = useChatStore((state) => state.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center text-gray-500">
          <p className="text-xl font-semibold">How can I help you today?</p>
        </div>
      ) : (
        messages.map((msg, index) => <Message key={msg.id || index} message={msg} />)
      )}
      <div ref={bottomRef} />
    </div>
  );
};
