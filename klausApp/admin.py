from django.contrib import admin

# Register your models here.

from .models import propertyTable
from .models import eventLogTable
from .models import listingTasksTable
from .models import addonTasksTable
from .models import Registration
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from import_export.resources import ModelResource
from import_export.admin import ImportExportMixin, ImportMixin, ExportActionModelAdmin

from django.contrib import admin
from import_export import resources





class BookResource(ModelResource):

    class Meta:
        model = Registration

class BookResource2(ModelResource):

   class Meta:
 		 model = eventLogTable

class BookResource3(ModelResource):

   class Meta:
 		 model = addonTasksTable
   
class BookResource4(ModelResource):

   class Meta:
 		 model = propertyTable
   
class BookResource5(ModelResource):

   class Meta:
 		 model = listingTasksTable
   


class BookAdmin(ImportExportModelAdmin):
    pass

admin.site.register(Registration, BookAdmin)
admin.site.register(eventLogTable, BookAdmin)
admin.site.register(addonTasksTable, BookAdmin)
admin.site.register(propertyTable, BookAdmin)
admin.site.register(listingTasksTable, BookAdmin)

class BookAdmin(ImportExportMixin, admin.ModelAdmin):
    list_filter = ['name', 'email']
    resource_class = BookResource

class BookAdmin2(ImportExportMixin, admin.ModelAdmin):
    list_filter = ['id', 'eventDetail', 'Date', 'username']
    resource_class = BookResource2

class BookAdmin3(ImportExportMixin, admin.ModelAdmin):
    list_filter = ['id', 'username', 'auctioneerRequired', 'stagingRequired', 
    'chemicalReportRequired']
    resource_class = BookResource3

class BookAdmin4(ImportExportMixin, admin.ModelAdmin):
    list_filter = ['id', 'username', 'propertyAddress', 'propertyImage', 'houseInArea1', 
    'houseInArea2', 'govtValuation']
    resource_class = BookResource4

class BookAdmin5(ImportExportMixin, admin.ModelAdmin):
    list_filter = ['id', 'username', 'lawyerRequired', 
    'tradeMeListing', 'hostAssigned', 'photosTaken', 'yardSaleSign']
    resource_class = BookResource5

class CategoryAdmin(ExportActionModelAdmin):
    pass


class AuthorAdmin(ImportMixin, admin.ModelAdmin):
    pass

