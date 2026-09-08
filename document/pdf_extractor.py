import os
from PyPDF2 import PdfReader

class PDFExtractor:
    def __init__(self):
        pass

    def extract_text(self, pdf_path):
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"Could not find PDF at: {pdf_path}")
            
        reader = PdfReader(pdf_path)
        full_text = ""
        
        # Loop through every page and extract text
        for page_num, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                full_text += text + "\n"
                
        return full_text

# Quick test for Dhruva
if __name__ == '__main__':
    extractor = PDFExtractor()
    print("PDF Extractor module initialized successfully. Ready for document parsing.")

