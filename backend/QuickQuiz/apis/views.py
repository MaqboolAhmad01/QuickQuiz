from .models import UploadedFile, User
from .serializers import UserSignupSerializer
from .utils import build_rest_password_link, generate_topics_from_document,verify_reset_password_token, run_llm, send_reset_password_email, verify_otp,load_pdf_file,chunk_document
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, OTPVerificationSerializer
from .utils import send_otp
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework_simplejwt.views import (
    TokenRefreshView,


)
from django.contrib.auth import get_user_model
from django.core.cache import cache


from drf_yasg.utils import swagger_auto_schema
from django.shortcuts import get_object_or_404


class OtpVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        if verify_otp(email, otp):
            User.objects.filter(email=email).update(is_verified=True)
            return Response({"message": "OTP verified successfully"})
        return Response(
            {"error": "Invalid or Expired OTP"},
            status=status.HTTP_400_BAD_REQUEST,
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
    permission_classes = [permissions.AllowAny]


    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code != 200:
            print(f"Token data: {response.data}")  # Debugging line
            return Response(response.data, status=response.status_code)
        data = response.data

        # Set HttpOnly cookies
       
        response.set_cookie(
            key="refresh_token",
            value=data["refresh"],
            httponly=True,
            secure=True,
            samesite="Strict"
        )

        # Remove tokens from the response body
        del response.data["refresh"]

        return response


class SignupView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()

            return Response(
                {
                    "message": "User created successfully",
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )



class UploadDocumentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        print("==== REQ001" \
        "UEST DEBUG ====")
        print("Content-Type:", request.META.get("CONTENT_TYPE"))
        print("User:", request.user)
        print("FILES:", request.FILES)
        print("POST:", request.POST)
        print("=======================")
        uploaded_file = request.FILES["file"]
        print(f"uploaded_file: {uploaded_file}")  # Debugging line

        doc = UploadedFile.objects.create(
            user=request.user,
            file=uploaded_file,
            original_name=uploaded_file.name,
            size=uploaded_file.size,
        )

        # documents = load_pdf_file(doc.file.path)
        # texts = chunk_document(documents)
        # print(f"texta-------------{texts}")
        # response = run_llm(texts)


        # print(f"response-------------{response}")

        # return Response(response)
        print(f"Document uploaded with ID: {doc.id} and file path: {doc.file.url}")
        return Response({
            "id": doc.id,
            "name": doc.original_name
        })
    
class ProcessFileView(APIView):

    def get(self, request, file_id):
        print(f"Processing file with ID: {file_id} for user: {request.user}")
        uploaded_file = get_object_or_404(UploadedFile, id=file_id, user=request.user)

        documents = load_pdf_file(uploaded_file.file.path)
        texts = chunk_document(documents)
        response = run_llm(texts)
        return Response(response)
    
class GenerateTopicsView(APIView):
    
    def get(self, request,file_id):
        uploaded_file = get_object_or_404(UploadedFile, id=file_id, user=request.user)
        documents = load_pdf_file(uploaded_file.file.path)
        texts = chunk_document(documents)
        response = generate_topics_from_document(texts)
        print(response)
        return Response(response)

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            return Response({"detail": "No refresh token"}, status=401)

        serializer = self.get_serializer(data={"refresh": refresh})
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        response = Response({"access": data["access"]})
        response.set_cookie(
            "refresh_token",
            data["refresh"],
            httponly=True,
            secure=True,
            samesite="Strict",
            path="/auth/refresh/",
        )

        return response

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": f"No user found with the email: {email}"},
                status=status.HTTP_404_NOT_FOUND,
            )
        reset_link = build_rest_password_link( user.id )
        send_reset_password_email(email=email, reset_link=reset_link)
        return Response( status=status.HTTP_200_OK)

class UpdatePasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, token):
        User = get_user_model()

    
        new_password = request.data.get("new_password")

        if not token:
            return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password:
            return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

        # retrieve user_id from cache
        user_id = cache.get(f"reset_pwd_{token}")
        if not user_id:
            return Response({"error": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        # get user and update password
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)