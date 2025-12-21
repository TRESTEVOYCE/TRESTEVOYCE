from django.test import TestCase, Client
from decimal import Decimal

from ecommerse_app.models import User, Store, Product, Cart, Orders

class ECommerceAPITests(TestCase):
    def setUp(self):
        # Test client
        self.client = Client()

        # Create test users
        self.user = User.objects.create(
            first_name="John",
            last_name="Doe",
            email_address="john@example.com",
            phone_number="1234567890",
            barangay="Brgy 1",
            municipality_or_city="City",
            province="Province",
            region="Region",
            is_seller=True
        )

        self.store_owner = User.objects.create(
            first_name="Store",
            last_name="Owner",
            email_address="storeowner@example.com",
            phone_number="0987654321",
            barangay="Brgy 2",
            municipality_or_city="City",
            province="Province",
            region="Region",
            is_seller=True
        )

        # Create test store
        self.store = Store.objects.create(
            store_owner=self.store_owner,
            store_name="Test Store",
            contact_number="123456",
            store_address="Address",
            store_description="Description"
        )

        # Create test product
        self.product = Product.objects.create(
            store=self.store,
            product_name="Test Product",
            price=Decimal("50.00"),
            product_description="Test Description"
        )

    # -----------------------
    # User tests
    # -----------------------
    def test_list_users(self):
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 200)

    def test_create_user(self):
        response = self.client.post("/api/users/create/", {
            "first_name": "Alice",
            "last_name": "Smith",
            "email_address": "alice@example.com",
            "phone_number": "111222333",
            "barangay": "Brgy 3",
            "municipality_or_city": "City",
            "province": "Province",
            "region": "Region",
            "is_seller": "true"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())

    # -----------------------
    # Store tests
    # -----------------------
    def test_list_stores(self):
        response = self.client.get("/api/stores/")
        self.assertEqual(response.status_code, 200)

    def test_create_store(self):
        response = self.client.post(f"/api/stores/create/{self.user.id}/", {
            "store_name": "New Store",
            "contact_number": "555555",
            "store_address": "New Address",
            "store_description": "New Description"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())

    # -----------------------
    # Product tests
    # -----------------------
    def test_show_products(self):
        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, 200)

    def test_create_product(self):
        response = self.client.post(f"/api/products/create/{self.store.id}/", {
            "product_name": "New Product",
            "price": "100.00",
            "product_description": "New Description"
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())

    # -----------------------
    # Cart tests
    # -----------------------
    # -----------------------
# Cart tests
# -----------------------
    def test_add_to_cart(self):
        response = self.client.post("/api/cart/add/", {
            "product_id": self.product.id,
            "quantity": 2,
            "user_id": self.user.id  # pass user_id here
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response.json())


    # -----------------------
    # Checkout tests
    # -----------------------
    def test_checkout_post_required(self):
        response = self.client.get("/api/checkout/")
        self.assertEqual(response.status_code, 405)

    # -----------------------
    # Orders tests
    # -----------------------
    def test_list_orders(self):
        response = self.client.get("/api/orders/")
        self.assertEqual(response.status_code, 200)

    def test_update_order_status_not_allowed(self):
        response = self.client.get("/api/orders/update/1/")
        self.assertEqual(response.status_code, 405)

    def test_delete_order_not_allowed(self):
        response = self.client.get("/api/orders/delete/1/")
        self.assertEqual(response.status_code, 405)
