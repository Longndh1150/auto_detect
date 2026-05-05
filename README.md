# AI Chat Web App Walkthrough

I have fully implemented the AI Chat Web App from scratch, incorporating all the "refactoring" requirements you specified. The system is built with a modular architecture and features a Gemini-like UI with a local Ollama backend.

## What Was Implemented

### Backend (`c:\Long\Projects\auto_detect\backend`)
- **FastAPI Core**: Minimal and fast backend entry point in `main.py`.
- **File Parser (`services/file_parser.py`)**: Supports parsing text from PDFs (via `pdfplumber`), DOCX (via `python-docx`), and images (via `pytesseract`).
- **Ollama Integration (`services/ollama.py`)**: Safely fetches available models and streams chat responses. It includes a `TIMEOUT` and handles malformed JSON lines robustly to prevent crashes.
- **File Upload & In-Memory Store (`routes/upload.py`, `store.py`)**: Uploaded files are parsed, checked against a 10MB limit, and their content is stored in-memory using a unique `file_id`.
- **Chat Endpoint (`routes/chat.py`)**: Accepts user messages along with any `file_ids`. If `file_ids` are present, it dynamically constructs the structured prompt:
  ```
  SYSTEM:
  You are a helpful AI assistant.
  USER:
  {user_input}
  CONTEXT:
  {file_text}
  ```

### Frontend (`c:\Long\Projects\auto_detect\frontend`)
- **Next.js 15 App Router**: Modern and fast frontend setup.
- **Zustand State Management (`store/chatStore.ts`)**: Manages the chat history, streaming state, selected model, and uploaded `fileIds`.
- **Gemini-Style UI**:
  - `Sidebar.tsx`: Auto-fetches local models and allows selection.
  - `InputBox.tsx`: Handles text input and file uploads. It disables inputs securely during streaming or uploading to prevent race conditions.
  - `Chat.tsx` & `Message.tsx`: Renders the conversation. Auto-scrolls to the bottom upon new chunks. Safely renders Markdown using `rehype-sanitize` and syntax-highlights code blocks using `react-syntax-highlighter` (with auto-detected language labels). 
    *Fixed: `ReactMarkdown` is now wrapped in a styled `div` to comply with the latest component typings.*

### ⚡ Status Check
- **Frontend**: Build successful (`npm run build` passed).
- **Backend**: Installation in progress (requires Ollama and Python dependencies).

## How to Run & Verify

You need to run three separate services to fully use the application.

### 1. Install Ollama & Models
If you haven't already, you need to install Ollama and download the models:
1. Download and install Ollama for Windows from [ollama.com](https://ollama.com/download).
2. Open a PowerShell terminal and run the following commands to download the models:
   ```powershell
   ollama pull llama3
   ollama pull llava
   ```
   *(Note: `llama3` is the default text model, and `llava` is the vision model required for direct image understanding).*

### 2. Start Ollama
Ensure you have the Ollama app running in the background on your machine.

### 2. Start the Backend
Open a new PowerShell terminal and run:
```powershell
cd c:\Long\Projects\auto_detect\backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

### 3. Start the Frontend
Open another PowerShell terminal and run:
```powershell
cd c:\Long\Projects\auto_detect\frontend
npm run dev
```

> [!TIP]
> Open your browser to `http://localhost:3000`. You should see the model list auto-populate on the left.
> Try uploading a PDF or DOCX file, wait for it to process, and then ask a question about its contents!

> [!WARNING]
> Tesseract OCR (used for image uploads) requires the Tesseract executable to be installed on your Windows machine and added to your PATH environment variable. If it's not installed, image uploads will fail gracefully and return an error message to the UI.
