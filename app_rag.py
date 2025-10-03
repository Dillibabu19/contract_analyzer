import os
from dotenv import load_dotenv
import fitz  # PyMuPDF
from langchain.text_splitter import RecursiveCharacterTextSplitter, CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import RetrievalQA

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
models = ["gemma-3n-e4b-it","gemma-3-4b-it","gemini-1.5-flash","gemini-2.0-flash","gemini-2.0-flash-lite"]

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def chunk_text(text, chunk_size=1000, chunk_overlap=200):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", ".", " "]
    )
    return splitter.split_text(text)

def summarize_chunk(text):
    llm = ChatGoogleGenerativeAI(model=f"{models[0]}", temperature=0.3)
    prompt = PromptTemplate.from_template("Summarize this contract clause:\n{text}")
    chain = prompt | llm
    return chain.invoke({"text": text})

def create_faiss_vectorstore(text):
    splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    documents = splitter.create_documents([text])
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vectorstore = FAISS.from_documents(documents, embeddings)
    return vectorstore

def chat_with_contract(qa_chain):
    print("\n💬 Ask questions about the contract. Type 'exit' to quit.")
    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            break
        answer = qa_chain.run(query)
        print("AI:", answer)


inpath = "./data/inputm.pdf"

raw_text = extract_text_from_pdf(inpath)

chunks = chunk_text(raw_text)

# sum_chunk = summarize_chunk(chunks)

vector_store = create_faiss_vectorstore(raw_text)


llm = ChatGoogleGenerativeAI(model=f"{models[2]}", temperature=0.3)
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=vector_store.as_retriever())

chat_with_contract(qa_chain)

# print(vector_store)