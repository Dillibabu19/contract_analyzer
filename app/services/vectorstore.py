from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.utils.textsplitter import split_text
import os

load_dotenv()

vectorstore = None

def store_in_vector_db(text,doc_id):    
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    embeddings = HuggingFaceEmbeddings(model_name=model_name)
    global vectorstore
    chunks = split_text(text)
    if vectorstore is None:
        vectorstore = FAISS.from_texts(chunks, embedding=embeddings, metadatas=[{"doc_id": doc_id}] * len(chunks))
    else:
        vectorstore = vectorstore.add_texts(chunks, metadatas=[{"doc_id": doc_id}] * len(chunks))

def retrive_data_from_vector_db(query):
    global vectorstore
    if vectorstore is None:
        return []
    return vectorstore.similarity_search(query, k=5)