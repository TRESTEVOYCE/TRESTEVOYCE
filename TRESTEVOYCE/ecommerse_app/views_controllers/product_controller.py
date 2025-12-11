from django.http import JsonResponse,HttpResponse
from ..models import Product,Store
from django.shortcuts import get_object_or_404


class ProductController:

#add a product from the database
    def create_product(request,id):
        
        store = get_object_or_404(Store,pk =id)

        if request.method == 'POST':

            product_name = request.POST.get('product_name')
            price = request.POST.get('price')
            product_image = request.FILES.get('product_image')
            product_description = request.POST.get('product_description')

            if price == None:
                return JsonResponse({'error':'Price cannot be empty'},status = 400)
            
            if product_name == None:
                return JsonResponse({'error':'Product name cannot be empty'},status = 400)
            
            try:
                price = int(price)

            except ValueError:
                return JsonResponse({'error':'data type must be integer'}, status = 400)
            
        product = Product.objects.create(
            store = store ,
            product_name = product_name,
            price = price,
            product_description = product_description
        )

        if product_image:
            product.product_image = product_image
            product.save()

    #get the datas from the database 
    def show_prodcuts(request):

        if request.method == 'GET':

            products = Product.objects.all()

            return JsonResponse(list(products),safe = False)
        
#to update a product information from the database
    def update_product_informations(request,id):
        
        product = get_object_or_404(Product,pk = id)

        if request.method == 'POST':
            
           
            product.price = request.POST.get('product_price',product.price)
            product.product_description = request.POST.get('product_description',product.product_description)
            product.product_image = request.FILES.get('product_image',product.product_image)

            if product.price == None:
                return JsonResponse ({'error':'price must not be zero'},status = 400)
            
            if product.product_name == None:
                return JsonResponse ({'error':'name must not be zero'},status = 400)
            
            try:
                product.price = int(product.price)

            except ValueError:
                return JsonResponse({'error':'data type must be integer'},status = 400)
            
            product.save()

            return JsonResponse({'message':'product information has been updated successfully'},status = 201)
            
#to delete a product from the database
    def remove_product(request,id):
        product = get_object_or_404(Product,pk = id)

        if request.method == 'POST':
            
            product.delete()
            return JsonResponse({'message:':' product succesfully deleted'},status = 201)
        
        return JsonResponse({'error':'Failed to delete the product'})
    







           

