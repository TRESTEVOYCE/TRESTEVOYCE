from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from ..models import Product

# --------------------------
# Login view
# --------------------------

def user_login(request):

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("home")
        else:
            messages.error(request, "Invalid username or password")

    #if request.user.is_authenticated:
        #return redirect("home")

    return render(request, "customer/login.html")


# --------------------------
# Logout view
# --------------------------
def user_logout(request):
    logout(request)
    return redirect("login")


# --------------------------
# Register view
# --------------------------
def register(request):
    #if request.user.is_authenticated:
        #return redirect("home")

    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")

        if password != password2:
            messages.error(request, "Passwords do not match")
        elif User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
        else:
            User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created successfully")
            return redirect("login")

    return render(request, "customer/signup.html")

def home(request):
    products = Product.objects.all()  # Fetch all products
    return render(request, 'customer/home.html', {'products': products})


# --------------------------
# Home view (protected)
# --------------------------
@login_required(login_url="login")
def home(request):
    return render(request, "customer/home.html", {"user": request.user})
