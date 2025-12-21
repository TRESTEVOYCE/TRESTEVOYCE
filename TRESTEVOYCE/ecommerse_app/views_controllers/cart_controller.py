from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from ..models import Cart, Product, Profile as User

@csrf_exempt
def add_to_cart(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    product_id = request.POST.get("product_id")
    quantity = int(request.POST.get("quantity", 1))
    user_id = request.POST.get("user_id")  # NEW: pass user_id

    if not user_id:
        return JsonResponse({"error": "user_id is required"}, status=400)

    user = get_object_or_404(User, pk=user_id)
    product = get_object_or_404(Product, pk=product_id)

    cart, created = Cart.objects.update_or_create(
        customer=user,
        defaults={"product": product, "quantity": quantity}
    )

    return JsonResponse({"message": "Added to cart"})
