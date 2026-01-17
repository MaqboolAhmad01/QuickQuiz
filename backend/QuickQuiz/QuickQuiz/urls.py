"""
URL configuration for QuickQuiz project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


from apis.views import CustomTokenObtainPairView, CookieTokenRefreshView
# JWT Bearer token
# bearer_scheme = openapi.SecurityScheme(
#     type=openapi.TYPE_API_KEY,
#     in_=openapi.IN_HEADER,
#     name="Authorization",
#     description="JWT Authorization header using the Bearer scheme. Example: 'Bearer <token>'",
# )

schema_view = get_schema_view(
    openapi.Info(
        title="Quick Quiz API",
        default_version='v1',
        description="API documentation for Tranqui Quick Quiz CRUD",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@quickquiz.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    authentication_classes=[],  # JWT auth still works

)


urlpatterns = [
    path("admin/", admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("auth/", include("apis.urls"))

]
