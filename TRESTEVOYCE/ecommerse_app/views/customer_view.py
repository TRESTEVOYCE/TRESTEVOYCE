from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

from ..models import User, Product


# =========================
# LOGIN
# =========================

def login_view(request):
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = User.objects.filter(email=email).first()
        if not user:
            messages.error(request, "Invalid email or password")
            return redirect('customer_login')

        auth_user = authenticate(
            request,
            username=user.username,
            password=password
        )

        if auth_user:
            login(request, auth_user)
            return redirect('home')
        else:
            messages.error(request, "Invalid email or password")

    return render(request, "customer/login.html")


# =========================
# LOGOUT
# =========================

def logout_view(request):
    logout(request)
    return redirect('customer_login')


# =========================
# SIGNUP
# =========================

def signup_view(request):
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
            return redirect('customer_signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
            return redirect('customer_signup')

        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        messages.success(request, "Account created successfully!")
        return redirect('customer_login')

    return render(request, "customer/signup.html")


# =========================
# HOME
# =========================

def home_views(request):
    return render(request, "customer/home.html")


# =========================
# PRODUCTS LIST
# =========================

def products_view(request):
    products = (
        Product.objects
        .select_related('store')
        .select_related('inventory')
        .filter(is_active=True)
    )

    return render(
        request,
        'customer/products.html',
        {'products': products}
    )
