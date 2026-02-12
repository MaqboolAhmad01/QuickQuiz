from django.urls import path
from .views import (
    GenerateTopicsView,
    SignupView,
    UpdatePasswordView,
    OtpVerificationView,
    OTPRetryView,
    UploadDocumentView,
    ProcessFileView,
    ResetPasswordView,
    LogoutView
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("verify-otp/", OtpVerificationView.as_view(), name="verify_otp"),
    path("resend-otp/", OTPRetryView.as_view(), name="resend_otp"),
    path("upload/", UploadDocumentView.as_view(), name="file_upload"),
    path("generate-quiz/<int:file_id>/", ProcessFileView.as_view()),
    path(
        "topics-list/<int:file_id>/", GenerateTopicsView.as_view(), name="topics_list"
    ),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path(
        "update-password/<str:token>/",
        UpdatePasswordView.as_view(),
        name="update_password",
    ),
    path("logout/", LogoutView.as_view(), name="logout"),
]
