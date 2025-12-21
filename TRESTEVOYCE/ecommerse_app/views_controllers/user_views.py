from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import Profile as User

@csrf_exempt
def create_user(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    first_name = request.POST.get("first_name")
    last_name = request.POST.get("last_name")
    email = request.POST.get("email_address")
    phone = request.POST.get("phone_number")
    barangay = request.POST.get("barangay")
    city = request.POST.get("municipality_or_city")
    province = request.POST.get("province")
    region = request.POST.get("region")
    is_seller = request.POST.get("is_seller") == "true"

    if not first_name or not last_name or not email:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    user = User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email_address=email,
        phone_number=phone,
        barangay=barangay,
        municipality_or_city=city,
        province=province,
        region=region,
        is_seller=is_seller
    )

    return JsonResponse({"message": "User created", "id": user.id}, status=201)


def list_users(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)

    users = User.objects.all()
    data = [
        {
            "id": u.id,
            "name": f"{u.first_name} {u.last_name}",
            "email": u.email_address,
            "is_seller": u.is_seller
        }
        for u in users
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
def update_user(request, user_id):
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "PUT or PATCH required"}, status=405)

    user = get_object_or_404(User, pk=user_id)
    user.first_name = request.POST.get("first_name", user.first_name)
    user.last_name = request.POST.get("last_name", user.last_name)
    user.email_address = request.POST.get("email_address", user.email_address)
    user.phone_number = request.POST.get("phone_number", user.phone_number)
    user.barangay = request.POST.get("barangay", user.barangay)
    user.municipality_or_city = request.POST.get("municipality_or_city", user.municipality_or_city)
    user.province = request.POST.get("province", user.province)
    user.region = request.POST.get("region", user.region)
    user.is_seller = request.POST.get("is_seller", str(user.is_seller)) == "true"
    user.save()

    return JsonResponse({"message": "User updated"})


@csrf_exempt
def delete_user(request, user_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)

    user = get_object_or_404(User, pk=user_id)
    user.delete()
    return JsonResponse({"message": "User deleted"})
