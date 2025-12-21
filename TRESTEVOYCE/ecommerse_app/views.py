from django.shortcuts import render, redirect

def login_view(request):
    return render(request, 'vendor/login.html')

def signup_view(request):
    return render(request, 'vendor/signup.html')

def base_view(request):
    return render(request, 'vendor/base.html')

def dashboard_view(request):
    return render(request, 'vendor/dashboard.html')

def products_view(request):
    return render(request, 'vendor/products.html')

def orders_view(request):
    return render(request, 'vendor/orders.html')

def analytics_view(request):
    return render(request, 'vendor/analytics.html')

def settings_view(request):
    return render(request, 'vendor/settings.html')

def notifications_view(request):
    return render(request, 'vendor/notifications.html')
