from django.contrib import admin
from .models import Product, Customer, Order, Cart, Inventory, Ordered_Item, Store, UserProfile

admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(Cart)
admin.site.register(Inventory)
admin.site.register(Ordered_Item)
admin.site.register(Store)
admin.site.register(UserProfile)
