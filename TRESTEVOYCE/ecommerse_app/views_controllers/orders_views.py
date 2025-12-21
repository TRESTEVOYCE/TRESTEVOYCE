from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from ..models import Orders

def list_orders(request):
    if request.method != "GET":
        return JsonResponse({"error": "GET required"}, status=405)

    orders = Orders.objects.select_related("customer")
    data = [
        {
            "id": o.id,
            "customer": f"{o.customer.first_name} {o.customer.last_name}",
            "total": o.total_amount,
            "status": o.order_status
        }
        for o in orders
    ]
    return JsonResponse(data, safe=False)


@csrf_exempt
def update_order_status(request, order_id):
    if request.method not in ["PUT", "PATCH"]:
        return JsonResponse({"error": "PUT or PATCH required"}, status=405)

    order = get_object_or_404(Orders, pk=order_id)
    status = request.POST.get("order_status")
    if status not in dict(Orders.STATUS):
        return JsonResponse({"error": "Invalid status"}, status=400)

    order.order_status = status
    order.save()
    return JsonResponse({"message": "Order status updated"})


@csrf_exempt
def delete_order(request, order_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE required"}, status=405)

    order = get_object_or_404(Orders, pk=order_id)
    order.delete()
    return JsonResponse({"message": "Order deleted"})
