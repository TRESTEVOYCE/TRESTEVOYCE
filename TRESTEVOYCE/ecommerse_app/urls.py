from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static

from ecommerse_app.views.vendor_views import (
    login_view as vendor_login,
    signup_view as vendor_signup,
    logout_view as vendor_logout,
    dashboard,
    products as vendor_products,
    add_product,
    orders as vendor_orders,
    analytics,
    setting,
    notifications
)

from ecommerse_app.views.customer_view import (
    login_view as customer_login,
    signup_view as customer_signup,
    logout_view as customer_logout,
    home_views,
    products_view
)

urlpatterns = [

    # ======================
    # ADMIN
    # ======================
    path('admin/', admin.site.urls),

    # ======================
    # DEFAULT
    # ======================
    path('', lambda request: redirect('customer_login')),

    # ======================
    # CUSTOMER ROUTES
    # ======================
    path('customer/login/', customer_login, name='customer_login'),
    path('customer/signup/', customer_signup, name='customer_signup'),
    path('customer/logout/', customer_logout, name='customer_logout'),
    path('customer/home/', home_views, name='home'),
    path('customer/products/', products_view, name='customer_products'),

    # ======================
    # VENDOR ROUTES
    # ======================
    path('vendor/login/', vendor_login, name='vendor_login'),
    path('vendor/signup/', vendor_signup, name='vendor_signup'),
    path('vendor/logout/', vendor_logout, name='vendor_logout'),

    path('vendor/dashboard/', dashboard, name='dashboard'),
    path('vendor/products/', vendor_products, name='vendor_products'),
    path('vendor/products/add/', add_product, name='add_product'),
    path('vendor/orders/', vendor_orders, name='vendor_orders'),
    path('vendor/analytics/', analytics, name='vendor_analytics'),
    path('vendor/settings/', setting, name='vendor_settings'),
    path('vendor/notifications/', notifications, name='vendor_notifications'),
]

# ======================
# MEDIA FILES (DEV ONLY)
# ======================
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
