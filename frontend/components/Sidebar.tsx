import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/chatStore';
import { MessageSquarePlus, Settings } from 'lucide-react';

export const Sidebar = () => {
  const { models, setModels, selectedModel, setSelectedModel } = useChatStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch('http://localhost:8000/models');
        if (!res.ok) throw new Error('Failed to fetch models');
        const data = await res.json();
        setModels(data.models);
        if (data.models.length > 0 && !selectedModel) {
          setSelectedModel(data.models[0]);
        }
      } catch (err) {
        setError('Could not connect to Ollama');
        console.error(err);
      }
    };
    
    fetchModels();
  }, []);

  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 w-full p-3 rounded-xl transition-colors"
        >
          <MessageSquarePlus className="w-5 h-5" />
          New Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">
            Model Selection
          </label>
          {error ? (
            <div className="text-red-500 text-sm">{error}</div>
          ) : (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            >
              {models.length === 0 ? (
                <option value="">No models found</option>
              ) : (
                models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))
              )}
            </select>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </div>
  );
};
