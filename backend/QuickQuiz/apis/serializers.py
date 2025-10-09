from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Extra check: only allow if verified
        if not self.user.is_verified:  # assume you added this field in User model
            raise AuthenticationFailed(
                "User is not verified. Please verify your email/OTP."
            )

        return data


class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username= validated_data["email"] ,
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
        )
        return user
