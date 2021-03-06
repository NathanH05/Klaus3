from django.shortcuts import render

# Create your views here.
from django.shortcuts import *
from django.template import RequestContext
from klausApp.forms import *
from django.forms.formsets import formset_factory

from klausApp.models import listingTasksTable
from klausApp.models import propertyTable
from klausApp.models import eventLogTable
from klausApp.models import addonTasksTable


from django.template.context_processors import csrf
from klausApp.models import ProfileImage

from django.http import HttpResponseRedirect
from klausApp.forms import SignUpForm
from klausApp.forms import QuestionForm


# Create your views here.

def index(request):
    
    QuestionFormSet = formset_factory(QuestionForm, extra=1)
    
   
    context = {
    'form' : QuestionForm(),
    'formset' : QuestionFormSet(),
    'html' : '$(function() {alert("hi")})', 
    }

    if request.method == "POST":
        formset = QuestionFormSet(request.POST)

        if(formset.is_valid()):
            message = "Thank you"
            for form in formset:
                form.save()
        else:
            message = "Something went wrong"
     
        return render(request,'Inventory/index.html',
        context)


        
    else:
        return render(request,'Inventory/index.html',
                context)

def index3(request):
    
    QuestionFormSet = formset_factory(QuestionForm, extra=1)
    
   
    context = {
    'form' : QuestionForm(),
    'html' : '$(function() {alert("hi")})', 
    }

    if request.method == "POST":
        formset = QuestionFormSet(request.POST)

        if(formset.is_valid()):
            message = "Thank you"
            for form in formset:
                form.save()
        else:
            message = "Something went wrong"
     
        return render_to_response('Inventory/index3.html',
        context, context_instance=RequestContext(request))


        
    else:
        return render_to_response('Inventory/index3.html',
                {'formset' : QuestionFormSet()}, context_instance=RequestContext(request))


def suggestion(request):
    if request.method == "POST":

    	form = SuggestionForm(request.POST)

    	if (form.is_valid()):
    		print(request.POST['title'])
    		message = 'success'
    	else:
            message = 'fail'

        return render_to_response('Inventory/suggestion.html',
              {'message': message},
              context_instance=RequestContext(request))
    else:
        return render_to_response('Inventory/suggestion.html',
                {'form': SuggestionForm()},
                context_instance=RequestContext(request))


def dash(request):
	eventLog = eventLogTable.objects
	propTable = propertyTable.objects.get(id=1)
	addonTable = addonTasksTable.objects
	listingTaskTable = listingTasksTable.objects

	return render(request, 'Inventory/dash.html',{
		'propTable': propTable,
		'eventLog1': eventLog.get(id=1),
		'eventLog2': eventLog.get(id=2),
		'eventLog3': eventLog.get(id=3),
		'eventLog4': eventLog.get(id=4),

		'listTask1':listingTaskTable.get(id=1),

		})

def negotiation(request):
    propTable = propertyTable.objects.get(id=1)
    listingTaskTable = listingTasksTable.objects
    
    form = SignUpForm()
    context = {
    "form" : form,

    'propTable': propTable,
    'listTask1':listingTaskTable.get(id=1),
    }
    return render(request, 'Inventory/negotiation.html', context)

def interview(request):
    QuestionFormSet = formset_factory(QuestionForm, extra=5)

    if request.method == "POST":
        formset = QuestionFormSet(request.POST)

        if(formset.is_valid()):
            message = "Thank you"
            for form in formset:
                print form
                form.save()
        else:
            message = "Something went wrong"

        return render_to_response('Inventory/index.html',
                {'message': message},
                context_instance=RequestContext(request))
    else:
        return render ('Inventory/index.html',
                {'formset': QuestionFormSet()})	

def contact(request):
	if request.method == "POST":
			form = FeedbackForm(request.POST)

			if(form.is_valid()):

				print(request.POST['name'])
				print(request.POST['email'])
				message = "Thankyou for your feedback"

			else:
				message = "sorry something went wrong"
			return render(request,'Inventory/contact.html',
				{'success' : message},
				context_instance=RequestContext(request))
	else:
			return render (request,'Inventory/contact.html',
			{'form':FeedbackForm()},
			context_instance=RequestContext(request))


