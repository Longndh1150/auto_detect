# 🧠 AI Chat Web App (Ollama + Gemini-style UI)

## Objective

Build a full-stack AI chat web application that:

* Automatically detects available local models from Ollama
* Provides a **Gemini-like chat UI**
* Supports **streaming responses**
* Renders **Markdown + syntax-highlighted code (C, C++, Python, JSON, etc.)**
* Accepts and processes **file uploads (PDF, DOCX, images)**
* Extracts text from files and uses it as context for LLM responses

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TailwindCSS
* Zustand (state management)
* react-markdown
* shiki (preferred) or highlight.js

### Backend

* FastAPI
* Python 3.10+
* requests

### AI इंtegration

* Ollama (local LLM server)

### File Processing

* pdfplumber (PDF)
* python-docx (DOCX)
* pytesseract + Pillow (OCR for images)

---

## Core Requirements

### 1. Model Detection (Ollama)

Fetch available models dynamically from:

GET http://localhost:11434/api/tags

Return list of model names for UI dropdown.

---

### 2. Chat API (Streaming)

Implement a FastAPI endpoint:

POST /chat

* Accept:

  * model (string)
  * messages (array of {role, content})
* Forward request to Ollama `/api/chat`
* Enable `"stream": true`
* Return streaming response (chunked)

---

### 3. Gemini-style UI

Design a clean chat interface:

#### Layout

* Sidebar:

  * Model selector (auto-loaded)
* Main Chat Area:

  * Message bubbles
  * Streaming assistant response
* Input Area:

  * Text input
  * File upload (drag & drop)

---

### 4. Streaming UX

* Render assistant response token-by-token
* Do NOT wait for full response
* Append chunks progressively to UI

---

### 5. Markdown Rendering

Render assistant responses using:

* Markdown support
* Code blocks with syntax highlighting

Must correctly format:

* C
* C++
* Python
* JSON
* Bash

---

### 6. File Upload & Processing

#### Supported Types:

* PDF
* DOCX
* Images (PNG, JPG)

#### Pipeline:

1. Upload file
2. Detect file type
3. Extract text:

   * PDF → pdfplumber
   * DOCX → python-docx
   * Image → pytesseract OCR
4. Append extracted text into prompt context
5. Send to LLM

---

### 7. Prompt Construction

Use structured prompting:

```
You are a helpful AI assistant.

User question:
{user_input}

Context from uploaded file:
{extracted_text}

Provide a clear, structured answer with proper formatting.
```

---

### 8. Code Block UX Enhancements (Optional but recommended)

* Copy-to-clipboard button
* Language label (top-right of code block)
* Auto-detect language

---

### 9. Handling Large Files

Implement chunking:

* Split text into smaller segments
* Optionally summarize or truncate
* Avoid exceeding model context window

---

### 10. Security Considerations

* Sanitize Markdown output (prevent XSS)
* Limit file size
* Validate file types
* Avoid arbitrary code execution

---

## Non-Functional Requirements

* Fast response time (use streaming)
* Clean UI (minimal, modern, Gemini-inspired)
* Modular code structure
* Easy to extend (RAG, memory, tools later)

---

## Suggested Folder Structure

### Backend

```
backend/
 ├── main.py
 ├── routes/
 ├── services/
 │    ├── ollama.py
 │    ├── file_parser.py
 └── utils/
```

### Frontend

```
frontend/
 ├── app/
 ├── components/
 │    ├── Chat.tsx
 │    ├── Message.tsx
 │    ├── InputBox.tsx
 │    ├── Sidebar.tsx
 ├── store/
 └── lib/
```

---

## MVP Scope (Build First)

* Model detection
* Chat with streaming
* Markdown + code rendering
* Upload + parse PDF/DOCX
* Basic chat UI

---

## Future Enhancements

* RAG with vector DB (ChromaDB)
* Conversation memory
* Tool calling / agents
* Multi-modal LLM (vision models in Ollama)
* Auth system

---

## Output Expectation

The system should behave like:

* ChatGPT / Gemini UI
* Local-first (Ollama)
* Developer-friendly (code-aware rendering)
* Document-aware (file context injection)

---

## Important Constraints

* Do NOT over-engineer
* Keep system modular
* Prioritize working MVP first
* Use streaming wherever possible

---

## Deliverables

* Fully working frontend + backend
* Clean UI with real-time streaming
* File upload + context-aware answers
* Syntax-highlighted responses

---

## Final Instruction

Focus on building a **functional, minimal, and extensible AI chat system** that mimics Gemini UX while running entirely on local models via Ollama.