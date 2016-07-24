from django import forms
from django.forms import ModelForm
from klausApp.models import Suggestion
from klausApp.models import Question
from klausApp.models import Registration

class SuggestionForm(forms.ModelForm):
    class Meta:
        model = Suggestion
        fields = ['email', 'title', 'description', 'time_sensitive', 'approved']
        



class Register(forms.Form):
	email = forms.EmailField(label="Your Email")
	name = forms.CharField(label="Name")
	message = forms.CharField(label="Body",widget=forms.Textarea)

class QuestionForm(forms.ModelForm):
	class Meta:
		model = Registration
		fields = ['email','name','phone']

