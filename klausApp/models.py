from __future__ import unicode_literals

from django.db import models

# Create your models here.

class propertyTable (models.Model):
	username = models.CharField(max_length=200, null=True)
	propertyAddress = models.CharField(max_length=200, null=True)
	propertyImage = models.ImageField()
	houseInArea1 = models.CharField(max_length=200, null=True)
	houseInArea2 = models.CharField(max_length=200, null=True)
	govtValuation = models.CharField(max_length=200, null=True)


class eventLogTable (models.Model):
	username = models.CharField(max_length=200, null=True)
	eventDetail = models.CharField(max_length=300, null=True)
	Date = models.DateField()


class listingTasksTable (models.Model):
	username = models.CharField(max_length=200, null=True)
	lawyerRequired = models.BooleanField(blank=False)
	tradeMeListing = models.BooleanField(blank=False)
	hostAssigned = models.BooleanField(blank=False)
	photosTaken = models.BooleanField(blank=False)
	yardSaleSign = models.BooleanField(blank=False)
	

class addonTasksTable (models.Model):
	username = models.CharField(max_length=200, null=True)
	auctioneerRequired = models.BooleanField()
	stagingRequired = models.BooleanField()
	chemicalReportRequired = models.BooleanField()


class Suggestion(models.Model):
    title = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    time_sensitive = models.BooleanField()
    approved = models.BooleanField()

class Question(models.Model):
   Question = models.TextField(blank=True)
   answered = models.NullBooleanField(null=True, blank=True)

class Registration(models.Model):
	name = models.CharField(blank=True, null=True,max_length=35)
	email = models.CharField(max_length=35,blank=True, null=True)
	phone = models.CharField(max_length=15,blank=True, null=True)

def __init__(self):
    self.hotspots = []

def nat(self, *args):
	new={'name':None,
	'email':None,
	'phone':None}

def __unicode(self):
	return self.name
