from google import genai
import pymupdf
import os
from dotenv import load_dotenv

load_dotenv()

ip = "./data/input.pdf"
op = "./data/output.txt"


api = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key = api)

prompt = "Please analyze the text and provide a clear and concise summary that includes: The main purpose and scope of the contract. Key parties involved. Important clauses including: Payment terms (amounts, schedules, penalties) Deadlines and important dates (start date, end date, milestones) Deliverables and obligations of each party Termination conditions and notice periods Confidentiality, liability, and dispute resolution clauses Total cost or financial commitments. Any special conditions or warranties. Make sure to highlight deadlines, costs, and any critical contractual obligations clearly."



def generate_response(pdf_text):
    response = client.models.generate_content(
    model="gemma-3-4b-it",
    # model="gemini-1.5-flash",
    contents=f"{pdf_text} - {prompt}",
    config = {
        # "system_instruction" : "list out the key points from the text provided your response should be clear and in below 5 points each point should have not more than 15 words",
        # "system_instruction" : "You are a bot that replies in a word or a line",
        "temperature" : 0.5,
    },
    
)
    return response


def extract_text_from_pdf(pdf_path):
    doc = pymupdf.open(pdf_path)
    with doc:
        text = ' '.join([page.get_text() for page in doc])
    
    #temp save
    # with open("./data/output.txt", 'w') as f:
    #     f.write(text)

    return text

pdtxt = extract_text_from_pdf(ip)
res = generate_response(pdtxt)

print(res.text)