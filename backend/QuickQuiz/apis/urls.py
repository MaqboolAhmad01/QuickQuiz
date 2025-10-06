from django.urls import path
from .views import SignupView, OtpVerificationView,OTPRetryView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify-otp/", OtpVerificationView.as_view(), name="verify_otp"),
    path("resend-otp/", OTPRetryView.as_view(), name="resend_otp"),
]
