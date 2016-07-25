from django import forms
from django.forms import ModelForm
from klausApp.models import Suggestion
from klausApp.models import Question
from klausApp.models import Registration
from klausApp.models import ProfileImage

class SignUpForm(forms.ModelForm):
	image =forms.FileField(label='')
	image.widget.attrs.update({'id' : 'your_id'})
	class Meta:
		model = ProfileImage
		fields = ['image',]

class QuestionForm(forms.Form):
	class Meta:
		model = Registration
		fields = ['email', 'name', 'phone']