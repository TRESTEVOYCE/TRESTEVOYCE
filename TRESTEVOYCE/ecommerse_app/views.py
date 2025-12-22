from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# ------------------------
# AUTHENTICATION VIEWS
# ------------------------

def login_view(request):
    if request.method == 'GET':
        # Consume any existing messages to prevent showing old error messages on page load
        list(messages.get_messages(request))
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user_obj = User.objects.filter(email=email).first()
        if user_obj:
            user = authenticate(request, username=user_obj.username, password=password)
            if user is not None:
                login(request, user)
                return redirect('base')  # Redirect to base.html with dashboard
            else:
                messages.error(request, "Invalid email or password")
        else:
            messages.error(request, "Invalid email or password")
    return render(request, 'vendor/login.html')


def signup_view(request):
    if request.method == 'GET':
        # Consume any existing messages to prevent showing old error messages on page load
        list(messages.get_messages(request))
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return render(request, 'vendor/signup.html')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return render(request, 'vendor/signup.html')

        # Create new user
        user = User.objects.create_user(username=username, email=email, password=password)
        login(request, user)
        return redirect('base')  # Redirect to base.html with dashboard

    return render(request, 'vendor/signup.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ------------------------
# MAIN VIEWS
# ------------------------

def base_view(request):
    """
    Base layout page. Dashboard.html is shown by default.
    Other pages will extend this layout by overriding the content block.
    """
    return render(request, 'vendor/base.html')



@login_required
def dashboard(request):
    # Replace these with real data from your models
    context = {
        "total_revenue": 5000,
        "total_orders": 25,
        "total_products": 50,
        "total_customers": 100,
        "orders": [
            {
                "id": 1,
                "customer": {"name": "John Doe"},
                "product": {"name": "Product A"},
                "amount": 100,
                "status": "Completed",
                "date": "2025-12-22",
            },
            # Add more dummy orders or fetch from database
        ]
    }
    return render(request, 'vendor/dashboard.html', context)


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
