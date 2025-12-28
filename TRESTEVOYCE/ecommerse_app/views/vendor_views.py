from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count

from ..models import (
    User,
    Store,
    Product,
    Inventory,
    Order,
    OrderedItem,
    Notification,
    Category,
    Sales
)

# =========================
# AUTHENTICATION
# =========================

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Try to find the user by email
        user_obj = User.objects.filter(email=email).first()
        if user_obj:
            # Authenticate using username (Django default)
            user = authenticate(request, username=user_obj.username, password=password)
            if user:
                login(request, user)
                return redirect('dashboard')

        messages.error(request, "Invalid email or password")

    return render(request, 'customer/login.html')
def vendor_signup_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        store_name = request.POST.get('store_name')
        contact_number = request.POST.get('contact_number')
        address = request.POST.get('address')
        description = request.POST.get('description')

        # Check if email or username already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
            return render(request, 'vendor/signup.html')
        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists.")
            return render(request, 'vendor/signup.html')

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create store for the user
        Store.objects.create(
            owner=user,
            name=store_name,
            contact_number=contact_number,
            address=address,
            description=description
        )

        messages.success(request, "Account created successfully! Please login.")
        return redirect('vendor_login')

    return render(request, 'vendor/signup.html')


def signup_view(request):
    if request.method == 'GET':
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

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_seller=True
        )

        login(request, user)
        return redirect('dashboard')

    return render(request, 'vendor/signup.html')


def logout_view(request):
    logout(request)
    return redirect('customer_login')


# =========================
# DASHBOARD
# =========================

@login_required(login_url='vendor_login')
def dashboard(request):
    store = Store.objects.filter(owner=request.user).first()

   
    total_revenue = OrderedItem.objects.filter(
        store=store
    ).aggregate(
        total=Sum('price_at_purchase')
    )['total'] or 0

    total_orders = Order.objects.filter(
        items__store=store
    ).distinct().count()

    total_products = Product.objects.filter(store=store).count()

    orders = Order.objects.filter(
        items__store=store
    ).order_by('-created_at')[:10]

    context = {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "orders": orders,
        "store": store,
    }

    return render(request, 'vendor/dashboard.html', context) 
"""def dashboard(request):
    store = get_object_or_404(Store, owner=request.user)

    total_revenue = OrderedItem.objects.filter(
        store=store
    ).aggregate(
        total=Sum('price_at_purchase')
    )['total'] or 0

    total_orders = Order.objects.filter(
        items__store=store
    ).distinct().count()

    total_products = Product.objects.filter(store=store).count()

    orders = Order.objects.filter(
        items__store=store
    ).order_by('-created_at')[:10]

    context = {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "orders": orders,
    }

    return render(request, 'vendor/dashboard.html', context)


     if not store:
        # Optional: show a message or redirect to a "create store" page
        return render(request, 'vendor/no_store.html', {
            "message": "You don't have a store yet. Please create one."
        })

"""

# =========================
# PRODUCTS
# =========================

@login_required
def products(request):
    # Try to get the store; if none exists, redirect with a message
    store = Store.objects.filter(owner=request.user).first()

    # Get products and annotate with sales count
    products = Product.objects.filter(store=store).annotate(
        sales_count=Count('ordereditem')
    )

    # Optional: show info if no products
    if not products.exists():
        messages.info(request, "No products have been added to your store yet.")

    return render(request, 'vendor/products.html', {'products': products})

@login_required

def add_product(request):
    # Try to get the store; if none exists, redirect with a message
    store = Store.objects.filter(owner=request.user).first()

    categories = Category.objects.all()

    if request.method == "POST":
        name = request.POST.get("name")
        price = request.POST.get("price")
        stock = request.POST.get("stock")
        category_id = request.POST.get("category")
        description = request.POST.get("description")

        # Validate required fields
        if not all([name, price, stock, category_id]):
            messages.error(request, "Please fill in all required fields.")
            return render(request, "vendor/add_product.html", {"categories": categories})

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            messages.error(request, "Selected category does not exist.")
            return render(request, "vendor/add_product.html", {"categories": categories})

        # Create product
        product = Product.objects.create(
            store=store,
            name=name,
            description=description,
            price=price,
            category=category
        )

        # Create inventory entry
        Inventory.objects.create(
            product=product,
            stock=stock
        )

        messages.success(request, "Product added successfully.")
        return redirect("vendor_products")  # updated to your products page

    return render(request, "vendor/add_product.html", {"categories": categories})


# =========================
# ORDERS
# =========================

@login_required
def orders(request):
    # Try to get the vendor's store
    store = Store.objects.filter(owner=request.user).first()
    # Fetch orders related to this store
    orders = Order.objects.filter(
        items__store=store
    ).distinct().order_by('-created_at')

    # Optional: show info if no orders
    if not orders.exists():
        messages.info(request, "No orders yet for your store.")

    return render(request, 'vendor/order.html', {'orders': orders})


# =========================
# ANALYTICS
# =========================

@login_required
def analytics(request):
    # Try to get the vendor's store
    store = Store.objects.filter(owner=request.user).first()

    # Aggregate sales data
    sales = OrderedItem.objects.filter(store=store).aggregate(
        total_sales=Sum('price_at_purchase'),
        total_items=Sum('quantity')
    )

    return render(request, 'vendor/analytics.html', {'sales': sales})


# =========================
# SETTINGS
# =========================

@login_required
def setting(request):
    return render(request, 'vendor/settings.html')


# =========================
# NOTIFICATIONS
# =========================

@login_required
def notifications(request):
    notifications = Notification.objects.filter(user=request.user)

    context = {
        'notifications': notifications,
        'total_count': notifications.count(),
        'unread_count': notifications.filter(is_read=False).count(),
        'high_priority_count': notifications.filter(is_urgent=True).count(),
    }

    return render(request, 'vendor/notifications.html', context)
