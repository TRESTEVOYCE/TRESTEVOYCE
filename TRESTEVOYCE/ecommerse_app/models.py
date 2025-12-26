from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length=55)
    last_name = models.CharField(max_length=55)
    email_address = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15)
    barangay = models.CharField(max_length=100)
    municipality_or_city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    is_seller = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Store(models.Model):
    store_name = models.CharField(max_length=255)
    store_owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store')
    store_profile = models.ImageField(upload_to='store_profiles/', blank=True, null=True)
    contact_number = models.CharField(max_length=15)
    store_address = models.CharField(max_length=255)
    store_creation_date = models.DateTimeField(auto_now_add=True)
    store_description = models.TextField()

    def __str__(self):
        return self.store_name


class Product(models.Model):
    product_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    product_image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    product_description = models.TextField()

    def __str__(self):
        return self.product_name


class Inventory(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='inventory')
    stock_quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.product_name} - {self.stock_quantity}"


class Cart(models.Model):
    customer = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer}'s cart"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.product_name} ({self.quantity})"


class Orders(models.Model):
    STATUS = [
        ('PENDING', 'Pending'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
        ('RETURNED', 'Returned'),
    ]

    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=STATUS, default='PENDING')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer}"


class OrderedItem(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_on_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.product_name} x {self.quantity}"


class Sales(models.Model):
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name='sales')
    total_earning = models.DecimalField(max_digits=12, decimal_places=2)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.store.store_name} - {self.total_earning}"
