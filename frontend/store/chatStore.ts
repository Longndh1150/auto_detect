import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
}

interface ChatState {
  messages: Message[];
  models: string[];
  selectedModel: string;
  fileIds: string[];
  visionImages: string[];
  isStreaming: boolean;
  addMessage: (msg: Message) => void;
  updateLastMessage: (chunk: string) => void;
  setModels: (models: string[]) => void;
  setSelectedModel: (model: string) => void;
  addFileId: (id: string) => void;
  clearFileIds: () => void;
  addVisionImage: (base64: string) => void;
  clearVisionImages: () => void;
  setStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  models: [],
  selectedModel: '',
  fileIds: [],
  visionImages: [],
  isStreaming: false,
  
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  updateLastMessage: (chunk) => set((state) => {
    const messages = [...state.messages];
    if (messages.length > 0) {
      messages[messages.length - 1].content += chunk;
    }
    return { messages };
  }),
  
  setModels: (models) => set({ models }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  addFileId: (id) => set((state) => ({ fileIds: [...state.fileIds, id] })),
  clearFileIds: () => set({ fileIds: [] }),
  addVisionImage: (base64) => set((state) => ({ visionImages: [...state.visionImages, base64] })),
  clearVisionImages: () => set({ visionImages: [] }),
  setStreaming: (isStreaming) => set({ isStreaming }),
}));
