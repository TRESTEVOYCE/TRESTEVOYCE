from django.shortcuts import redirect
from django.urls import path
from .views import login_view,signup_view,home_views,logout_view

urlpatterns = [
    path('', lambda request: redirect('login')),
    path("login/", login_view,name = 'login'),
    path("signup/", signup_view,name = 'signup'),
    path('home/', home_views, name='home'),
    path('logout/', logout_view, name='logout'),

    
]