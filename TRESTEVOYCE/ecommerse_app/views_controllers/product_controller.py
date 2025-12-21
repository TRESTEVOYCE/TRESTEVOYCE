from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal

from ..models import Product, Store, Inventory

@csrf_exempt
def create_product(request, store_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    store = get_object_or_404(Store, pk=store_id)

    product_name = request.POST.get("product_name")
    price = request.POST.get("price")
    product_description = request.POST.get("product_description")
    product_image = request.FILES.get("product_image")

    if not product_name or not price:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    try:
        price = Decimal(price)
    except:
        return JsonResponse({"error": "Invalid price"}, status=400)

    product = Product.objects.create(
        store=store,
        product_name=product_name,
        price=price,
        product_description=product_description or ""
    )

    if product_image:
        product.product_image = product_image
        product.save()

    # create inventory
    Inventory.objects.create(product_id=product, stock_quantity=0)

    return JsonResponse({"message": "Product created", "id": product.id}, status=201)


def show_products(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)

    products = Product.objects.select_related("store")
    data = [
        {"id": p.id, "name": p.product_name, "price": str(p.price), "store": p.store.store_name}
        for p in products
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
def update_product(request, product_id):
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "PUT or PATCH required"}, status=405)

    product = get_object_or_404(Product, pk=product_id)

    price = request.POST.get("price")
    description = request.POST.get("product_description")

    if price:
        try:
            product.price = Decimal(price)
        except:
            return JsonResponse({"error": "Invalid price"}, status=400)

    if description:
        product.product_description = description

    if "product_image" in request.FILES:
        product.product_image = request.FILES["product_image"]

    product.save()
    return JsonResponse({"message": "Product updated"})


@csrf_exempt
def delete_product(request, product_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)

    product = get_object_or_404(Product, pk=product_id)
    product.delete()
    return JsonResponse({"message": "Product deleted"})