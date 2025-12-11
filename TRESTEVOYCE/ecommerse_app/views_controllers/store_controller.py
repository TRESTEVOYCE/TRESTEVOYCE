from django.http import JsonResponse,HttpResponse
from ..models import Store,User
from django.shortcuts import get_object_or_404


class StoreController:

    def create_store(request,id):

        user = get_object_or_404(User,pk=id)

        if request.method == 'POST':
            
            store_name = request.POST.get('store_name')
            store_profile = request.FILES.get('store_profile')
            contact_number = request.POST.get('contact_number')
            store_address = request.POST.get('store_address')
            store_desciption = request.POST.get('store_description')


            user.is_seller = True
            user.save()

            #checks if the users has a store already
            if hasattr(user,'store'):
                return JsonResponse({'error':'User has a store already'},status = 400)
            
            if contact_number == None:
                return JsonResponse({'error':'Contact Number is Required'})
            
            contact_number = int(contact_number)
            
            store = Store.objects.create(
                user = user,
                store_name = store_name,
                contact_number = contact_number,
                store_address = store_address,
                store_description = store_desciption,
            )

            if store_profile:
                store.store_profile = store_profile
                store.save()

            return JsonResponse({'message':'data has been successfully added'})
        
    def edit_store_information(request,id):

        store = get_object_or_404(Store,pk = id)
        
        if request.method == 'POST':
            
            #to safely update the values in the database
            store.store_name = request.POST.get('store_name',store.store_name)
            store_profile = request.FILES.get('store_profile',store.store_profile)
            store.contact_number = request.POST.get('contact_number',store.contact_number)
            store.store_address = request.POST.get('store_address',store.store_address)
            store.store_description = request.POST.get('store_description',store.store_description)

            if store_profile:
                store.user = store_profile

            if store.contact_number == None:
                return JsonResponse({'error':'a number must be applied'},status = 400)
            
            try:
                store.contact_number = int(store.contact_number)

            except ValueError:
                return JsonResponse({'error':'value must be a integer'},status = 400)
            
            store.save()

            return JsonResponse({'message':'store information successfully updated'},status = 201)
        
    def remove_store(request,id):
        user = get_object_or_404(User,pk = id)
        if request.method == 'POST':
            store = get_object_or_404(Store,id = id)
            store.delete()
            user.is_seller = False
            return JsonResponse({'message':'store succesfully deleted'},status = 201)
        
        return JsonResponse({'error':'failed to delete store'},status = 400)