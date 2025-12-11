from django.db import models

# Create your models here.
class User(models.Model):

    first_name = models.CharField(max_length=55)
    last_name = models.CharField(max_length=55)
    email_address = models.EmailField(max_length=100)
    phone_number = models.IntegerField(null=True)
    barangay = models.CharField(max_length=100)
    municipality_or_city = models.CharField(max_length=100)
    province = models.CharField(max_length=100,null=True,blank=True)
    region = models.CharField(max_length=100)
    is_seller = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/')
    

    def __str__(self):
        return self.first_name, self.last_name

class Store(models.Model):
   
   store_name = models.CharField(max_length=255)
   store_owner = models.OneToOneField(User,on_delete=models.CASCADE,related_name='store')
   store_profile = models.ImageField(upload_to='store_profiles/')
   contact_number = models.IntegerField(null=True)
   store_address = models.CharField(max_length=255)
   store_creation_date = models.DateTimeField(auto_now_add=True)
   store_description = models.TextField()

   def __str__(self):
       return self.store_name,self.store_owner
   
class Product(models.Model):

    product_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    product_image = models.ImageField(upload_to='product_images/')
    store = models.ForeignKey(Store,on_delete=models.CASCADE)
    product_description = models.TextField()

    def __str__(self):
        return self.product_name,self.price

class Inventory(models.Model):

    product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
    stock_quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_id,self.stock_quantity

class Cart(models.Model):

    customer = models.OneToOneField(User,on_delete=models.CASCADE,related_name='cart')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer ,self.product

class Orders(models.Model):

    STATUS = [
        ('PENDING','Pending'),
        ('SHIPPED','Shipped'),
        ('DELIVERED','Delivered'),
        ('CANCELLED','Cancelled'),
        ('RETURNED','Returned'),
    ]

    customer = models.OneToOneField(User,on_delete=models.CASCADE,related_name='orders')
    total_amount = models.PositiveIntegerField()
    order_status = models.CharField(choices=STATUS,default="PENDING", max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now_add=True,null=True)

    def __str__(self):
        return self.customer , self.total_amount

class Ordered_Item(models.Model):

    order_id = models.ForeignKey(Orders,on_delete=models.CASCADE)
    product_id = models.ForeignKey(Product,on_delete=models.CASCADE)
    store_id = models.ForeignKey(Store,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    price_on_purchase = models.DecimalField(max_digits=10,decimal_places=2,default=0)

    def __str__(self):
        return self.order_id , self.product_id

class Sales(models.Model):

    store_id = models.OneToOneField(Store,on_delete=models.CASCADE,related_name='sales')
    ordered_item_id = models.OneToOneField(Ordered_Item,on_delete=models.CASCADE)
    total_earning = models.DecimalField(max_digits=10,decimal_places=2)
    creation_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
            return self.store_id , self.total_earning