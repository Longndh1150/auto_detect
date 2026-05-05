import io
import pdfplumber
import docx
import pytesseract
from PIL import Image

MAX_TEXT_LENGTH = 100000  # Reasonable limit to avoid blowing up memory/context

def parse_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse PDF: {str(e)}")
    return text[:MAX_TEXT_LENGTH]

def parse_docx(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Failed to parse DOCX: {str(e)}")
    return text[:MAX_TEXT_LENGTH]

def parse_image(file_bytes: bytes) -> str:
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
    except Exception as e:
        raise ValueError(f"Failed to parse Image (OCR): {str(e)}")
    return text[:MAX_TEXT_LENGTH]

def extract_text_from_file(filename: str, file_bytes: bytes) -> str:
    ext = filename.lower().split('.')[-1]
    if ext == 'pdf':
        return parse_pdf(file_bytes)
    elif ext in ['docx', 'doc']:
        return parse_docx(file_bytes)
    elif ext in ['png', 'jpg', 'jpeg']:
        return parse_image(file_bytes)
    elif ext in ['txt', 'md', 'csv', 'json']:
        try:
            return file_bytes.decode('utf-8')[:MAX_TEXT_LENGTH]
        except Exception as e:
            raise ValueError(f"Failed to decode text file: {str(e)}")
    else:
        raise ValueError(f"Unsupported file type: {ext}")
