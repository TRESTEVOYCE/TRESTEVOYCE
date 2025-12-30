from django.db import models

# Create your models here.
#types of data to be used images,recipe name, recipe description,recipe ingredients ,time added,author
#id is auto incremented so no need to declare it
#text fields are used for longer texts such as comments or descriptions
#date-time-field is used to store date and time accordingly and auto-now-add is used to autoatically add the date and time stamp of the data as long as it is set to true
#image field is used for images and uplooad to is used to specify the location of the image in the server folder

class Recipes(models.Model):
    recipe_name = models.CharField(max_length=50)
    recipe_description = models.TextField()
    recipe_ingredients = models.TextField()
    time_added = models.DateTimeField(auto_now_add=True)
    author = models.CharField(max_length=55)
    recipe_images = models.ImageField(upload_to='recipe_pictures')