from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

# Load .env dari folder backend/
basedir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(basedir, "..", ".env")  # backend/.env
load_dotenv(env_path)

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("SMTP_USERNAME") or "",
    MAIL_PASSWORD=os.getenv("SMTP_PASSWORD") or "",
    MAIL_FROM=os.getenv("SMTP_USERNAME") or "",
    MAIL_PORT=int(os.getenv("SMTP_PORT") or 587),
    MAIL_SERVER=os.getenv("SMTP_SERVER") or "smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fm = FastMail(conf)
