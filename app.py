from google import genai
import pymupdf
import os
from dotenv import load_dotenv


load_dotenv()

inpath = "./data/inputm.pdf"
outpath = "./data/output.txt"

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)
models = ["gemma-3n-e4b-it","gemma-3-4b-it","gemini-1.5-flash","gemini-2.0-flash","gemini-2.0-flash-lite"]

model_info = client.models.get(model=f"{models[2]}")

prompt = "Please analyze the text and provide a clear and concise summary that includes: " \
"The main purpose and scope of the contract. Key parties involved. Important clauses including: " \
"Payment terms (amounts, schedules, penalties) Deadlines and important dates (start date, end date, " \
"milestones) Deliverables and obligations of each party Termination conditions and notice periods Confidentiality, " \
"liability, and dispute resolution clauses Total cost or financial commitments. Any special conditions or warranties." \
" Make sure to highlight deadlines, costs, and any critical contractual obligations clearly."

#to extrxt text from pdf
def extract_text_from_pdf(pdf_path):
    doc = pymupdf.open(pdf_path)
    text = ' '.join([page.get_text() for page in doc])
    return text

#to split the extracted text to managable chunks
def chunk_text(text, chunk_size=2000, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0,len(words),chunk_size - overlap):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
    return chunks

# to summarize chunks into a single prompt
def summarize_chunks(chunks):
    if len(chunks)>=3:
        return f"{chunks[0]} +{chunks[1]} +{chunks[2]}"
    sum_chunks = []
    for chunk in chunks:
        prompt = "Please summarize the text chunk but maintain key points clauses and also dates etc."
        sum_chunks.append(generate_response(chunk,prompt,models[0]).text)
    return "\n".join(sum_chunks)

# to generate response using gemini api
def generate_response(pdf_text,prompt,model):
    response = client.models.generate_content(
    model= f"{model}",
    contents=f"{pdf_text} - {prompt}",
    # config = {
    #     # "system_instruction" : "list out the key points from the text provided your response should be clear and in below 5 points each point should have not more than 15 words",
    #     # "system_instruction" : "You are a bot that replies in a word or a line",
    #     "temperature" : 0.5,
    # },
)   
    return response

print("Extracting text from pdf...")

pdtxt = extract_text_from_pdf(inpath)

print("Converting to chunks...")
chunks = chunk_text(pdtxt)

print("Summarizing Chunks...")
sum_chunks = summarize_chunks(chunks)

print("Generating Response...")
res = generate_response(sum_chunks,prompt,models[2])

print(res.text)

print("Setting up Queries....")
chat = client.chats.create(model = models[2])

additional_prompt = "The text is from a contract and answer my following questions briefly dont over " \
"elaborate unless asked to and also add references"

chat.send_message(pdtxt + additional_prompt)

while True:
    ch = input("Any Queries... ?\n")
    
    match ch:
        case "exit":
            print("Thank You :)\nExiting....")
            break
        case _:
            res = chat.send_message(ch)
            print(res.text)



print(f"{model_info.input_token_limit=}")
print(f"{model_info.output_token_limit=}")

#END