from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from ..models import Cart, Product

@csrf_exempt
def add_to_cart(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    product_id = request.POST.get("product_id")
    quantity = int(request.POST.get("quantity", 1))

    product = get_object_or_404(Product, pk=product_id)
    cart, created = Cart.objects.update_or_create(
        customer=request.user,
        defaults={"product": product, "quantity": quantity}
    )

    return JsonResponse({"message": "Added to cart"})