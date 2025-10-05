from .models import User
from .serializers import UserSignupSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

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
