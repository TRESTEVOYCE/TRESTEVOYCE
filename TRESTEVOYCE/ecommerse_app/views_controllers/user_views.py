from django.http import JsonResponse,HttpResponse
from ..models import User,Store
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
            self.province = request.POST.get('province')
            self.region = request.POST.get('region')
            self.is_seller = request.POST.get('is_seller',False)
            self.profile_picture = request.FILES.get('profile_picture')


            if self.phone_number == None:
                return JsonResponse({'error':'phone number must not be none'})
            
            try:
                phone_number = int(self.phone_number)
            
            except ValueError:
                return JsonResponse({'error':'value must be a integer'})
        
            self.user = User.objects.create(
                first_name = self.first_name,
                last_name = self.last_name,
                phone_number = phone_number,
                barangay = self.barangay,
                municipality_or_city = self.munucipality_or_city,
                province = self.province,
                region = self.region,
                is_seller = False,
            )
            if self.profile_picture:
                self.user.profile_picture = self.profile_picture
                self.user.save()

        
        return JsonResponse({'message':'data has been successfully added'})

    def edit_user(self,request,id):
        
        user = get_object_or_404(User,id = id)

        if request.method == 'POST':

            user.first_name = request.POST.get('first_name',user.first_name)
            user.last_name = request.POST.get('last_name',user.last_name)
            user.email_address = request.POST.get('email_address',user.email_address)
            user.phone_number = request.POST.get('phone_number',user.phone_number)
            user.barangay = request.POST.get('barangay',user.barangay)
            user.municipality_or_city = request.POST.get('municipality_or_city',user.municipality_or_city)
            user.province = request.POST.get('province',user.province)
            user.region = request.POST.get('region',user.region)

            profile_picture = request.FILES.get('profile_picture')
            if profile_picture:
                user.profile_picture = profile_picture

            if user.phone_number == None:
                return JsonResponse({'error':'phone number must not be none'})
            
            try:
                user.phone_number = int(user.phone_number)
            
            except ValueError:
                return JsonResponse({'error':'value must be a integer'})
            
            user.save()

            return JsonResponse({'message': 'User updated successfully'})

    def remove_user(self,request,id):

        if request.method == 'POST':    

            user = get_object_or_404(User, id = id)
            user.delete()
            return JsonResponse({'message':'Successfully Deleted'})

        return JsonResponse({'error':'Failed to Delete Data'})



        
