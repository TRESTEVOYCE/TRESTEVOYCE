from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ..models import Store, User

@csrf_exempt
def create_store(request, user_id):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    user = get_object_or_404(User, pk=user_id)

    store_name = request.POST.get("store_name")
    contact_number = request.POST.get("contact_number")
    store_address = request.POST.get("store_address")
    store_description = request.POST.get("store_description")
    store_profile = request.FILES.get("store_profile")

    if not store_name or not store_address:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    store = Store.objects.create(
        store_owner=user,
        store_name=store_name,
        contact_number=contact_number,
        store_address=store_address,
        store_description=store_description
    )

    if store_profile:
        store.store_profile = store_profile
        store.save()

    return JsonResponse({"message": "Store created", "id": store.id}, status=201)


def list_stores(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)

    stores = Store.objects.select_related("store_owner")
    data = [
        {
            "id": s.id,
            "store_name": s.store_name,
            "owner": f"{s.store_owner.first_name} {s.store_owner.last_name}",
            "address": s.store_address
        }
        for s in stores
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
def update_store(request, store_id):
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "PUT or PATCH required"}, status=405)

    store = get_object_or_404(Store, pk=store_id)

    store.store_name = request.POST.get("store_name", store.store_name)
    store.contact_number = request.POST.get("contact_number", store.contact_number)
    store.store_address = request.POST.get("store_address", store.store_address)
    store.store_description = request.POST.get("store_description", store.store_description)

    if "store_profile" in request.FILES:
        store.store_profile = request.FILES["store_profile"]

    store.save()
    return JsonResponse({"message": "Store updated"})


@csrf_exempt
def delete_store(request, store_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)

    store = get_object_or_404(Store, pk=store_id)
    store.delete()
    return JsonResponse({"message": "Store deleted"})
