from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Product, Customer, Order
from django.db.models import Sum
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
                return redirect('dashboard')  # Redirect to base.html with dashboard
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
        return redirect('dashboard')  # Redirect to base.html with dashboard

    return render(request, 'vendor/signup.html')


def logout_view(request):
    logout(request)
    return redirect('login')


# ------------------------
# MAIN VIEWS
# ------------------------




from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Product, Customer, Order
from django.db.models import Sum

@login_required
def dashboard(request):
    total_revenue = Order.objects.aggregate(total=Sum('amount'))['total'] or 0
    total_orders = Order.objects.count()
    total_products = Product.objects.count()
    total_customers = Customer.objects.count()
    orders = Order.objects.order_by('-date')[:10]  # last 10 orders

    context = {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "total_customers": total_customers,
        "orders": orders
    }
    return render(request, 'vendor/dashboard.html', context)



def products(request):
    return render(request, 'vendor/products.html')


def orders(request):
    return render(request, 'vendor/orders.html')


def analytics(request):
    return render(request, 'vendor/analytics.html')


def setting(request):
    return render(request, 'vendor/settings.html')


def notifications(request):
    return render(request, 'vendor/notifications.html')
