from email.mime.text import MIMEText
from django.conf import settings
import logging
import smtplib
import random
import string
from django.core.cache import cache

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
