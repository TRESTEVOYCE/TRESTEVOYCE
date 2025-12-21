from django.shortcuts import render, redirect

def login_view(request):
    return render(request, 'login.html')

def signup_view(request):
    return render(request, 'signup.html')

def base_view(request):
    return render(request, 'base.html')

def dashboard_view(request):
    return render(request, 'dashboard.html')

def products_view(request):
    return render(request, 'products.html')

def orders_view(request):
    return render(request, 'orders.html')

def analytics_view(request):
    return render(request, 'analytics.html')

def settings_view(request):
    return render(request, 'settings.html')

def notifications_view(request):
    return render(request, 'notifications.html')
