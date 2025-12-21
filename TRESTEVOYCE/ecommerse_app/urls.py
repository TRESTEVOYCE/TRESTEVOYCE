from django.urls import path
from .views_controllers import product_controller,  cart_controller, checkout_views, user_views, store_controller, orders_views,login_logout_auth

urlpatterns = [
    path('', login_logout_auth.user_login, name='root_login'),  # root URL shows login page
    path('login/', login_logout_auth.user_login, name='login'),
    path('home/', login_logout_auth.home, name='home'),
    path('logout/', login_logout_auth.user_logout, name='logout'),
    path('register/', login_logout_auth.register, name='register'),
    
    path("products/", product_controller.show_products),
    path("products/create/<int:store_id>/", product_controller.create_product),
    path("products/update/<int:product_id>/", product_controller.update_product),
    path("products/delete/<int:product_id>/", product_controller.delete_product),

    path("cart/add/", cart_controller.add_to_cart),
    path("checkout/", checkout_views.checkout_view),

    path("users/", user_views.list_users),
    path("users/create/", user_views.create_user),
    path("users/update/<int:user_id>/", user_views.update_user),
    path("users/delete/<int:user_id>/", user_views.delete_user),

    path("stores/", store_controller.list_stores),
    path("stores/create/<int:user_id>/", store_controller.create_store),
    path("stores/update/<int:store_id>/", store_controller.update_store),
    path("stores/delete/<int:store_id>/", store_controller.delete_store),

    path("orders/", orders_views.list_orders),
    path("orders/update/<int:order_id>/", orders_views.update_order_status),
    path("orders/delete/<int:order_id>/", orders_views.delete_order),
]
