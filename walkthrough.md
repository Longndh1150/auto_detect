# Walkthrough: Vision Model Support

We have successfully implemented support for vision models (`llava`, `bakllava`) allowing users to upload images and ask questions about them. 

## Changes Made

### 1. Backend Updates
- **`backend/routes/chat.py`**: Updated the Pydantic `Message` model to accept an `images` property (`Optional[List[str]]`). The raw base64 data is now correctly parsed and forwarded to the Ollama `/api/chat` endpoint inside the message history.

### 2. Frontend Store
- **`frontend/store/chatStore.ts`**: Added `visionImages` array to hold temporary base64 image strings. Also updated the UI `Message` interface to handle `images` property cleanly, and implemented functions to `addVisionImage` and `clearVisionImages`.

### 3. Smart Upload Logic
- **`frontend/components/InputBox.tsx`**: 
  - Added a `VISION_MODELS` whitelist.
  - Intercepted `handleFileUpload`: When an image is uploaded and a vision model is active, we now read the file via `FileReader` into a base64 string. The image bypasses the backend OCR endpoint and is staged directly in the browser's memory.
  - During `handleSend`, the `images` property is injected directly into the user's message payload.

## Validation
- **OCR Fallback Maintained**: Standard text models (e.g., `llama3`) will still route images through the existing Python backend OCR flow, returning a `file_id`.
- **Backward Compatibility**: Non-vision text files (PDF, DOCX) remain unaffected and use the standard contextual file ID pipeline.
- Both frontend and backend seamlessly toggle between base64 insertion or context injection based on the model chosen!
