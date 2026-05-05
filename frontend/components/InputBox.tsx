import React, { useState, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { v4 as uuidv4 } from 'uuid';
import { Paperclip, Send, X, Loader2 } from 'lucide-react';

export const InputBox = () => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([]);
  
  const { 
    addMessage, 
    updateLastMessage, 
    selectedModel, 
    messages, 
    fileIds, 
    addFileId, 
    clearFileIds,
    setStreaming,
    isStreaming
  } = useChatStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || isStreaming) return;
    if (!selectedModel) {
      alert("Please select a model first");
      return;
    }

    const userMessage = {
      id: uuidv4(),
      role: 'user' as const,
      content: input,
    };
    
    const assistantMessageId = uuidv4();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant' as const,
      content: '',
    };

    addMessage(userMessage);
    addMessage(assistantMessage);
    setInput('');
    setStreaming(true);
    setUploadError('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          file_ids: fileIds,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          updateLastMessage(chunk);
        }
      }
      
      // Clear files after successful send
      clearFileIds();
      setUploadedFiles([]);
    } catch (error) {
      console.error(error);
      updateLastMessage('\n\n**Error:** Failed to get response.');
    } finally {
      setStreaming(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await response.json();
      addFileId(data.file_id);
      setUploadedFiles(prev => [...prev, { id: data.file_id, name: data.filename }]);
    } catch (error: any) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {uploadedFiles.map(file => (
            <div key={file.id} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              <span className="truncate max-w-[200px]">{file.name}</span>
            </div>
          ))}
        </div>
      )}
      
      {uploadError && (
        <div className="text-red-500 text-sm mb-2">{uploadError}</div>
      )}

      <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-3xl p-2 pb-2 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isStreaming}
          className="p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Paperclip className="w-6 h-6" />}
        </button>
        
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 max-h-48 min-h-[56px] resize-none bg-transparent p-4 focus:outline-none dark:text-white"
          rows={1}
        />
        
        <button
          onClick={handleSend}
          disabled={isStreaming || (!input.trim() && uploadedFiles.length === 0)}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:bg-gray-400 m-1"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
