from django.db import transaction
from django.core.exceptions import ValidationError
from decimal import Decimal

from ecommerse_app.models import Cart, Orders, Ordered_Item, Inventory, Sales

@transaction.atomic
def checkout(user):
    """
    Checkout logic compatible with your models
    """
    try:
        cart = Cart.objects.select_related("product", "product__store").get(customer=user)
    except Cart.DoesNotExist:
        raise ValidationError("Cart is empty")

    inventory = Inventory.objects.select_for_update().get(product_id=cart.product)

    if inventory.stock_quantity < cart.quantity:
        raise ValidationError("Not enough stock")

    total_amount = cart.product.price * cart.quantity

    order, created = Orders.objects.update_or_create(
        customer=user,
        defaults={"total_amount": int(total_amount), "order_status": "PENDING"}
    )

    ordered_item = Ordered_Item.objects.create(
        order_id=order,
        product_id=cart.product,
        store_id=cart.product.store,
        quantity=cart.quantity,
        price_on_purchase=cart.product.price
    )

    # decrease inventory
    inventory.stock_quantity -= cart.quantity
    inventory.save()

    # create sales
    Sales.objects.update_or_create(
        store_id=cart.product.store,
        defaults={"ordered_item_id": ordered_item, "total_earning": cart.product.price * cart.quantity}
    )

    cart.delete()
    return order
