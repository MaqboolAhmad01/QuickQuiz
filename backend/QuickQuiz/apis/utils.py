from email.mime.text import MIMEText
from django.conf import settings
import logging
import smtplib
import random
import string
from django.core.cache import cache
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel


class GeneratedQuiz(BaseModel):
    question: str
    answer: str
    options: list[str]

class ModelResponse(BaseModel):

   quiz: list[GeneratedQuiz]

# from langchain_core.vectorstores import InMemoryVectorStore
# from langchain_community.embeddings import FakeEmbeddings


logger = logging.getLogger(__name__)


def save_otp(user_email: str, otp: str):
    cache.set(f"otp:{user_email}", otp, timeout=300)


def verify_otp(user_email: str, otp: str) -> bool:
    stored = cache.get(f"otp:{user_email}")
    return stored == otp


EMAIL_SENDER = settings.EMAIL_SENDER
EMAIL_PASSWORD = settings.EMAIL_PASSWORD


def _send_verification_email(email: str, otp_code: str) -> None:
    subject = "Your OTP Code"
    body = f"Your OTP code is {otp_code}."
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = email
    try:
        with smtplib.SMTP_SSL(host="smtp.gmail.com", port=465) as server:
            server.login(user=EMAIL_SENDER, password=EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, email, msg.as_string())

    except smtplib.SMTPAuthenticationError as e:
        logger.error(msg=f"Error in sending OTP: {e}")


def _generate_otp() -> str:
    """Generates a 6-digit OTP."""
    return str(random.randint(a=100000, b=999999))


def send_otp(email: str) -> None:
    try:
        otp_code = _generate_otp()
        _send_verification_email(email=email, otp_code=otp_code)
        save_otp(user_email=email, otp=otp_code)
    except Exception as e:
        logger.error(f"Error sending OTP to {email}: {str(e)}")
        raise e


def generate_random_code() -> str:
    random_code = "".join(random.choices(string.ascii_letters + string.digits, k=6))
    return f"{random_code}"


def load_pdf_file(file_path: str) -> list[Document]:
    loader = PyPDFLoader(file_path)

    docs = loader.load()

    return docs


def chunk_document(documents: list[Document]):
    """
    Chunks the document into smaller pieces for processing.
    """
    chunks = []
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=0)

    for document in documents:
        chunks.append(text_splitter.split_text(document.page_content))
    return chunks


def run_llm(context: list[str]):
    

    messages = [
        (
            "system",
            """
            You are a helpful assistant that can generate MCQs based quizto evaluate the student. Translate the user sentence.
            Always provides the output in proper json format like this:
            [
                {{
                    "question": "What is the capital of France?",
                    "options": ["Berlin", "Madrid", "Paris", "Rome"],
                    "answer": "Paris"
                }},
                {{
                    "question": "Which planet is known as the Red Planet?",
                    "options": ["Earth", "Mars", "Jupiter", "Saturn"],
                    "answer": "Mars"
                }}
            ]
            """,
        ),
        ("human", f"Use the following context to generate the quiz:{context}"),
    ]
    model = ChatGoogleGenerativeAI(
        model="gemini-3-pro-preview",
        api_key="",
    )
    structured_model = model.with_structured_output(
        schema=ModelResponse.model_json_schema(), method="json_schema"
    )

    response = structured_model.invoke(messages)
    print(response)
    return response


# def create_vector_store(docs: list[Document]):
#     embeddings = FakeEmbeddings()

#     vector_store = InMemoryVectorStore.from_documents(
#         documents=docs,
#         embedding=embeddings
#     )

#     return vector_store
