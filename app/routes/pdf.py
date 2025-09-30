from fastapi import APIRouter
from app.services.pdfextracter import extract_text_from_url
from app.services.vectorstore import store_in_vector_db
from app.services.userfiles import add_user_file

router = APIRouter()

@router.post("/upload_pdf")
async def upload_pdf(payload:dict):
    url = payload.get("url")
    file_name = payload.get("file_name")
    file_id = payload.get("file_id")
    if not url:
        return {"Error": "No url Provided"}
    
    add_user_file(file_url=url,file_name=file_name,file_id=file_id,user_id=1)

    text = await extract_text_from_url(url)
    # store_in_vector_db(text["text"],doc_id=url)
    store_in_vector_db(text,doc_id=url)
    return {"Message": "Pdf Prossesed and stored in Vector DB" , "Content": f"{text}"}