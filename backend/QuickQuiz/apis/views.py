from .models import User
from .serializers import UserSignupSerializer
from .utils import verify_otp
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, OTPVerificationSerializer
from .utils import send_otp
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status


class OtpVerificationView(generics.CreateAPIView):
    serializer_class = OTPVerificationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        if verify_otp(email, otp):
            User.objects.filter(email=email).update(is_verified=True)
            return Response(
                {"message": "OTP verified successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Invalid or Expired OTP"}, status=status.HTTP_400_BAD_REQUEST
            )


class OTPRetryView(generics.CreateAPIView):
    """
    Handles resending OTP to the user's email.
    """

    serializer_class = OTPVerificationSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            email = serializer.validated_data["email"]
            if not email:
                return Response(
                    {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
                )
            user = User.objects.get(email=email)
            if not user:
                return Response(
                    {"error": f"No user found with the email: {email}"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            send_otp(email=email)
            return Response(
                {"message": "OTP resent successfully."}, status=status.HTTP_200_OK
            )
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "User created successfully",
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )
