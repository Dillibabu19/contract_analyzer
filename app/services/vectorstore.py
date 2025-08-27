from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.utils.textsplitter import split_text
import os

load_dotenv()

vectorstore = None

def store_in_vector_db(text,doc_id):
    GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")

    if not GOOGLE_API_KEY:
        raise ValueError("Api Key Not Found")
    
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",api_key=GOOGLE_API_KEY)
    global vectorstore
    chunks = split_text(text)
    if vectorstore is None:
        vectorstore = FAISS.from_texts(chunks, embedding=embeddings, metadatas=[{"doc_id": doc_id}] * len(chunks))

    else:
        vectorstore = vectorstore.add_texts(chunks, metadatas=[{"doc_id": doc_id}] * len(chunks))

    print("📦 Number of docs in vectorstore:", len(vectorstore.index_to_docstore_id))



def retrive_data_from_vector_db(query):
    global vectorstore
    if vectorstore is None:
        return []
    return vectorstore.similarity_search(query, k=5)