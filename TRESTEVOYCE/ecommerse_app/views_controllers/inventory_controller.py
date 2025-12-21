from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from ..models import Inventory,Product


class InventoryController:

    def add_product_in_inventory(request,id):
        
        product = get_object_or_404(Product,pk = id)

        if request.method == 'POST':

            product_name = request.POST.get('product_name')
            stock_quantity = request.POST.get('stock_quantity')

            try:
                if stock_quantity < 0:
                    return JsonResponse ({'error':'stock cant be less than zero'},status = 400)
                else:
                    stock_quantity = int(stock_quantity)

            except ValueError:
                return JsonResponse ({'error':'must only input positive numbers'},status = 400)
            
            inventory = Inventory.objects.create(
                product_name = product_name,
                stock_quantity = stock_quantity
            )

        return JsonResponse ({'message':'succesfully added into the inventory'},status = 201)
    
    
    def edit_inventory(request,id):
        
        inventory = get_object_or_404(Inventory,pk = id)
        if request.method == 'POST':
            #update or edit the values inside the inventory
            
            inventory.product_name = request.POST.get('product_name',inventory.product_name)
            inventory.stock_quantity = request.POST.get('product_name',inventory.stock_quantity)

            try:
                if inventory.stock_quantity < 0:
                    return JsonResponse({'error':'values must be greater than zero'},status = 400)
                
                else:
                    inventory.stock_quantity = int(inventory.stock_quantity)
            except ValueError:

                return JsonResponse({'error':'values must be integers'},status = 400)
            

            inventory.save()

            return JsonResponse({'message':'store information successfully updated'},status = 201)
        
    def show_inventory(request,id):

        if request.method == 'GET':

            inventory = Inventory.objects.all()

            return JsonResponse(list(inventory),safe = False)

    def delete_item_in_inventory(request,id):
        invetory = get_object_or_404(Inventory,pk = id)

        if request.method == 'POST':

            invetory.delete()

            return JsonResponse({'message':'suuccessfully deleted an item in the inventory'})
        
        return JsonResponse({'error':'failed deleting a item'})
    
    