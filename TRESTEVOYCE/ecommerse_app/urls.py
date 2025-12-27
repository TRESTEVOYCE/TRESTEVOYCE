from django.urls import path
from . import views

app_name = 'ecommerse_app'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),

    path('dashboard/', views.dashboard, name='dashboard'),
    path('products/', views.products, name='products'),
    path('products/add/', views.add_product, name='add_product'),
    path('orders/', views.orders, name='orders'),
    path('analytics/', views.analytics, name='analytics'),
    path('settings/', views.setting, name='settings'),
    path('notifications/', views.notifications, name='notifications'),
]
