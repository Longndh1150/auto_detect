from fastapi import APIRouter, UploadFile, File, HTTPException
from services.file_parser import extract_text_from_file
from store import add_file

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
            
        text = extract_text_from_file(file.filename, file_bytes)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No readable text found in file")
            
        file_id = add_file(text)
        
        return {"file_id": file_id, "filename": file.filename, "message": "File processed successfully"}
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
