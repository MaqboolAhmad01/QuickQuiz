from email.mime.text import MIMEText
from django.conf import settings
import logging
import smtplib
import random
import string
import hashlib
from django.core.cache import cache
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_google_genai import ChatGoogleGenerativeAI
from email.mime.multipart import MIMEMultipart
from django.core.mail import send_mail

from pydantic import BaseModel
import secrets
import os


class TopicsSchema(BaseModel):
    topics: list[str]   # proper runtime type for validation

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
    
    send_mail(
        subject,
        body,
        None,         # default from email is already set
        [email],
        fail_silently=True,
    )
    # msg = MIMEText(body)
    # msg["Subject"] = subject
    # msg["From"] = EMAIL_SENDER
    # msg["To"] = email
    # try:
    #     with smtplib.SMTP_SSL(host="smtp.gmail.com", port=465) as server:
    #         server.login(user=EMAIL_SENDER, password=EMAIL_PASSWORD)
    #         server.sendmail(EMAIL_SENDER, email, msg.as_string())

    # except smtplib.SMTPAuthenticationError as e:
    #     logger.error(msg=f"Error in sending OTP: {e}")


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
        api_key=os.getenv("GOOGLE_GENAI_API_KEY"),
    )
    structured_model = model.with_structured_output(
        schema=ModelResponse.model_json_schema(), method="json_schema"
    )

    response = structured_model.invoke(messages)
    print(response)
    return response

def generate_topics_from_document(documents:list[str]):
    messages = [
        (
            "system",
            """
            You are a helpful assistant that can generate topics from the given document.
            These topics will be utilized in creating quizzes for students.
            Always provides the output in proper json format like this:
            {
                "topics": ["Topic 1", "Topic 2", "Topic 3"]
            }
            """,
        ),
        ("human", f"Generate topics from the following document :{documents}"),
    ]
    model = ChatGoogleGenerativeAI(
        model="gemini-3-pro-preview",
        api_key=os.getenv("GOOGLE_GENAI_API_KEY"),
    )
    
    structured_model = model.with_structured_output(
        schema=TopicsSchema.model_json_schema(),
        method="json_schema"
    )
   

    response = structured_model.invoke(messages)
    return response

# def create_vector_store(docs: list[Document]):
#     embeddings = FakeEmbeddings()

#     vector_store = InMemoryVectorStore.from_documents(
#         documents=docs,
#         embedding=embeddings
#     )

#     return vector_store
def build_rest_password_link(user_id: str) -> str:
    raw_token = secrets.token_urlsafe(32)
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={raw_token}/"
    hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()
    cache.set(f"reset_pwd_{raw_token}", user_id, timeout=900)  # expires in 15 minutes
    return reset_link

def send_reset_password_email(email: str, reset_link: str) -> None:
    subject = "Password Reset Request"
    
    # # Create a multipart message
    # msg = MIMEMultipart("alternative")
    # msg["Subject"] = subject
    # msg["From"] = EMAIL_SENDER
    # msg["To"] = email

    # # Plain text fallback (for email clients that don't support HTML)
    # text = f"Click the following link to reset your password: {reset_link}"

    # HTML version
    html = f"""
    <html>
      <body>
        <p>Click the following link to reset your password:</p>
        <p><a href="{reset_link}">Reset Password</a></p>
      </body>
    </html>
    """
    
    send_mail(
        subject,
        message="Here is the link to reset your password.",  # fallback text
        html_message=html,
        from_email= None,         # default from email is already set
        recipient_list=[email],
        fail_silently=True,
    )

    # # Attach both plain text and HTML versions
    # msg.attach(MIMEText(text, "plain"))
    # msg.attach(MIMEText(html, "html"))

    # try:
    #     with smtplib.SMTP_SSL(host="smtp.gmail.com", port=465) as server:
    #         server.login(user=EMAIL_SENDER, password=EMAIL_PASSWORD)
    #         server.sendmail(EMAIL_SENDER, email, msg.as_string())
    # except smtplib.SMTPAuthenticationError as e:
    #     logger.error(f"Error in sending password reset email: {e}")

def verify_reset_password_token(token:str)->bool:
    hashed_token = hashlib.sha256(token.encode()).hexdigest()
    stored_hashed_token = cache.get(f"forget_password_token:{token}")
    if stored_hashed_token != hashed_token:
        return False
    return True