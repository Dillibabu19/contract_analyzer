#extract content from url and storing it in vector db

from fastapi import HTTPException
import requests, fitz

async def extract_text_from_url(url: str):
    try:
        response = requests.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=400 , detail=f"Failed to get PDF")
        try:
            doc = fitz.open(stream= response.content, filetype = "pdf")
        except Exception as e:
            raise HTTPException(status_code=400 , detail=f"Error Opening PDF: {e}")
        
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        return text


    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    
  
