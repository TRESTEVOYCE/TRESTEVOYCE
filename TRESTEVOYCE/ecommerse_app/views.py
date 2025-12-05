from django.http import JsonResponse,HttpResponse
from .models import User,Store
from django.shortcuts import get_object_or_404


#this class will handle all of the CRUD methods for the user model

class UserController:
    
    def create_user(self,request):
        
        if request.method == 'POST':

            self.first_name = request.POST.get('first_name')
            self.last_name = request.POST.get('last_name')
            self.email_address =request.POST.get('email_address')
            self.phone_number = request.POST.get('phone_number')
            self.barangay = request.POST.get('barangay')
            self.munucipality_or_city = request.POST.get('munucipality_or_city')
            self.region = request.POST.get('region')
            self.is_seller = request.POST.get('is_seller',False)
            self.profile_picture = request.FILES.get('profile_picture')


            if self.phone_number == None:
                return JsonResponse({'error':'phone number must not be none'})
            
            phone_number = int(self.phone_number)
        
            self.user = User.objects.create(
                first_name = self.first_name,
                last_name = self.last_name,
                phone_number = phone_number,
                barangay = self.barangay,
                municipality_or_city = self.munucipality_or_city,
                region = self.region,
                is_seller = False,
            )
        if self.profile_picture:
            self.user.profile_picture = self.profile_picture
            self.user.save()

        
        return JsonResponse({'message':'data has been successfully added'})

#this class will handle all of the CRUD methods for the Store model

class StoreController:

    def create_store(self,request,id):

        self.user = get_object_or_404(User,pk=id)

        if request.method == 'POST':
            
            self.store_name = request.POST.get('store_name')
            self.store_profile = request.FILE.get('store_profile')
            self.contact_number = request.POST.get('contact_number')
            self.store_address = request.POST.get('store_address')
            self.store_desciption = request.POST.get('store_description')


            if self.user:  
                self.update_seller = User.objects.update(is_seller = True)


            if hasattr(self.user,'store'):
                return JsonResponse({'error':'User has a store already'},status = 400)
            
            if self.contact_number == None:
                return JsonResponse({'error':'Contact Number is Required'})
            
            contact_number = int(self.contact_number)
            
            self.store = Store.objects.create(
                store_name = self.store_name,
                contact_number = contact_number,
                store_address = self.store_address,
                store_description = self.store_desciption,
            )

            if self.store_profile:
                self.store.store_profile = self.store_profile
                self.store.save()

            return JsonResponse({'message':'data has been successfully added'})