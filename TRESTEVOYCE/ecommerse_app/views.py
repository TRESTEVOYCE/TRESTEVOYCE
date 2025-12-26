from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from .models import Product



def login_view(request):
    
    if request.method == "POST":
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        try:
            username = User.objects.get(email=email).username
        except User.DoesNotExist:
            messages.error(request, "Invalid email or password")
            return redirect("customer/login.html")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, "Invalid email or password")
            
    return render(request, "customer/login.html")

def logout_view(request):
    if request.method == "POST":
         logout(request)
         return redirect('login')
    return render (request,"customer/login.html")

def signup_view(request):
     
    if request.method == "POST":
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken")
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
        else:
            # Directly save to the built-in User model
            User.objects.create_user(username=username, email=email, password=password)
            messages.success(request, "Account created successfully!")
            return redirect('login')
        
    return render (request,"customer/signup.html")


def home_views(request):
    return render(request,"customer/home.html")

def products_view(request):
    # Fetch all products with related store and inventory
    products = Product.objects.select_related('store').prefetch_related('inventory').all()
    return render(request, 'customer/products.html', {'products': products})