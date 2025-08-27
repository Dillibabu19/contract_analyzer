from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import os

load_dotenv()

models = ["gemma-3n-e4b-it","gemma-3-4b-it","gemini-1.5-flash","gemini-2.0-flash","gemini-2.0-flash-lite"]


def generate_answer(question , docs):
    context = "\n".join([doc.page_content for doc in docs])
    gemini_key = os.getenv("GEMINI_API_KEY")
    llm = ChatGoogleGenerativeAI(model=f"{models[2]}", temperature=0.3, google_api_key = gemini_key)
    prompt = f"""Use the following context to answer the question:\n{context}\n\nQuestion: {question} \n If the answer is not in the context politely say I don't know based on the contract"""
    response = llm.invoke(prompt)
    return response