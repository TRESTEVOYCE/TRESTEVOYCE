from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

def login_view(request):
    return render(request, 'vendor/login.html')


def signup_view(request):
    return render(request, 'vendor/signup.html')


def base_view(request):
    return redirect('dashboard')


def dashboard_view(request):
    return render(request, 'vendor/dashboard.html')


def products_view(request):
    return render(request, 'vendor/products.html')


def orders_view(request):
    return render(request, 'vendor/orders.html')


def analytics_view(request):
    return render(request, 'vendoranalytics.html')


def settings_view(request):
    return render(request, 'vendor/settings.html')


def notifications_view(request):
    return render(request, 'vendor/notifications.html')


def logout_view(request):
    logout(request)
    return redirect('login')
