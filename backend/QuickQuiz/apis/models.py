from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import random
import string
import uuid


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        If no password is provided, generates a random password.
        """
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        if password is None:
            password = self.generate_random_password()
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)

    def generate_random_password(self, length=12):
        """
        Generates a random password consisting of uppercase, lowercase letters, digits, and punctuation.
        :param length: Length of the password to be generated.
        :return: Randomly generated password.
        """
        characters = string.ascii_letters + string.digits + string.punctuation
        password = "".join(random.choice(characters) for _ in range(length))
        return password


class User(AbstractUser,BaseModel):
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    
    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]  


    def __str__(self):
        return self.email


# Create your models here.
class Quiz(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    total_marks = models.IntegerField(default=0)

    def __str__(self):
        return self.title


class Question(BaseModel):
    quiz = models.ForeignKey(Quiz, related_name="questions", on_delete=models.CASCADE)
    text = models.TextField()
    marks = models.IntegerField(default=1)

    def __str__(self):
        return self.text


class AnswerOption(BaseModel):
    question = models.ForeignKey(
        Question, related_name="answer_options", on_delete=models.CASCADE
    )
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class Result(BaseModel):
    quiz = models.ForeignKey(Quiz, related_name="results", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="results", on_delete=models.CASCADE)
    score = models.IntegerField()

    def __str__(self):
        return f"{self.user.email} - {self.quiz.title} - {self.score}"
