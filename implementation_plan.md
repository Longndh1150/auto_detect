# AI Chat Web App Implementation Plan

We will build a full-stack AI chat web application mimicking Gemini's UI, powered locally by Ollama, and supporting file context ingestion. 
*Note: Since there is no existing codebase yet, we will build the initial version from scratch incorporating all the new requirements provided.*

## Proposed Changes

We will divide the project into two main directories: `backend` and `frontend` within `c:\Long\Projects\auto_detect`.

### Backend Setup (FastAPI)

1. **Environment Setup**:
   - Create a Python virtual environment.
   - Install dependencies: `fastapi`, `uvicorn`, `requests`, `python-multipart`, `pdfplumber`, `python-docx`, `pytesseract`, `Pillow`.

2. **File Structure**:
   - `backend/main.py`: Entry point for FastAPI application, CORS configuration.
   - `backend/routes/chat.py`: API routes for `/chat` (streaming) and `/models`.
   - `backend/routes/upload.py`: API routes for file uploading and processing.
   - `backend/services/ollama.py`: Functions to communicate with the local Ollama instance (fetching models, sending chat requests with streaming).
   - `backend/services/file_parser.py`: Functions to extract text from PDF, DOCX, and images.
   - `backend/store.py`: Simple in-memory store for mapping `file_id` to extracted text.

3. **Core APIs**:
   - `GET /models`: Fetches tags from `http://localhost:11434/api/tags`.
   - `POST /upload`: Accepts file, checks size limit, detects type, parses text using `file_parser.py`. Stores the text in an in-memory dictionary with a generated UUID (`file_id`) and returns the `file_id`. Handles parsing errors gracefully.
   - `POST /chat`: 
     - Accepts `model` (string), `messages` (array), and `file_ids` (array of strings).
     - Retrieves text from in-memory store using `file_ids`.
     - Constructs the prompt using the structured format:
       ```
       SYSTEM:
       You are a helpful AI assistant.
       USER:
       {user_input}
       CONTEXT:
       {file_text}
       ```
     - Truncates context if it exceeds a reasonable token limit.
     - Sends request to Ollama with a timeout. Handles requests failures and malformed JSON lines safely.
     - Streams response chunk-by-chunk.

### Frontend Setup (Next.js)

1. **Environment Setup**:
   - Initialize a Next.js App Router project using `npx create-next-app@latest frontend`.
   - Install dependencies: `zustand`, `react-markdown`, `remark-gfm`, `react-syntax-highlighter`, `lucide-react`, `uuid`, `rehype-sanitize`.

2. **File Structure**:
   - `frontend/app/page.tsx`: Main chat page layout.
   - `frontend/components/Chat.tsx`: Main chat container with auto-scroll to latest message.
   - `frontend/components/Message.tsx`: Renders individual user/assistant messages with sanitized markdown support (using `rehype-sanitize`) and syntax highlighting.
   - `frontend/components/InputBox.tsx`: Handles text input and file upload. Displays loading states.
   - `frontend/components/Sidebar.tsx`: Displays model selector.
   - `frontend/store/chatStore.ts`: Zustand store for managing messages, streaming buffer state, selected model, and uploaded `file_ids`.

3. **Core Features**:
   - **Model Detection**: Fetch available models on load.
   - **Chat Interface**: Responsive Gemini-like layout with TailwindCSS.
   - **Streaming**: Handle chunked responses, append to a streaming buffer state safely, and manage loading/error states.
   - **Markdown Rendering**: Render sanitized markdown and code blocks.
   - **File Upload**: Handle drag-and-drop, send to `POST /upload`, receive `file_id`, and store in state.

## Open Questions

> [!IMPORTANT]
> 1. There is no existing codebase in the directory. I will build this from scratch incorporating all your new requirements (file_id architecture, structured prompt, streaming fixes, error handling, etc.). Is this acceptable?
> 2. Do you have Tesseract OCR installed on your Windows machine? `pytesseract` requires the Tesseract executable.
> 3. Ollama should be running locally on port 11434. Please confirm it is installed and running.

## Verification Plan

### Automated / API Tests
- Use Python's `requests` or `curl` to test `GET /models`, `POST /upload`, and verify error responses.

### Manual Verification
- Start Ollama server.
- Start FastAPI backend (`uvicorn main:app --reload`).
- Start Next.js frontend (`npm run dev`).
- Open `localhost:3000` in the browser.
- Verify uploading a file returns a `file_id`.
- Send a message with the uploaded file, verify the backend receives `file_ids` and injects context.
- Verify streaming works smoothly without crashing on chunk fragments.
- Verify markdown is rendered securely and code blocks are highlighted.
