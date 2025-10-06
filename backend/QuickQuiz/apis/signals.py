from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .utils import send_otp

User = get_user_model()

@receiver(post_save, sender=User)
def send_otp_on_signup(sender, instance, created, **kwargs):
    if created:  # only when user is first created
        print("hello")
        send_otp(instance.email)
        