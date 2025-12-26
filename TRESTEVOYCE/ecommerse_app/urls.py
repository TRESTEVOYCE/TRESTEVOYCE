from django.shortcuts import redirect
from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', lambda request: redirect('login')),
    path("login/", login_view,name = 'login'),
    path("signup/", signup_view,name = 'signup'),
    path('home/', home_views, name='home'),
    path('logout/', logout_view, name='logout'),
    path('products/', products_view, name='products'),

    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)