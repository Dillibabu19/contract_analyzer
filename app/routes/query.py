from fastapi import APIRouter
from app.services.ragengine import generate_answer
from app.services.vectorstore import retrive_data_from_vector_db

router = APIRouter()

@router.post('/ask')
async def ask_question(payload: dict):
    question = payload.get("question")
    if not question:
        return {"Error": "No question provided"}
    relevant_chunks = retrive_data_from_vector_db(question)
    answer = generate_answer(question,relevant_chunks)
    return answer