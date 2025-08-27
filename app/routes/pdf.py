from fastapi import APIRouter
from app.services.pdfextracter import extract_text_from_url
from app.services.vectorstore import store_in_vector_db

router = APIRouter()

@router.post("/upload_pdf")
async def upload_pdf(payload:dict):
    url = payload.get("url")
    if not url:
        return {"Error": "No url Provided"}
    text = await extract_text_from_url(url)
    # store_in_vector_db(text["text"],doc_id=url)
    store_in_vector_db(text,doc_id=url)
    return {"Message": "Pdf Prossesed and stored in Vector DB" , "Content": f"{text}"}