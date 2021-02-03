# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('singleplayer/dif/', views.dif, name='dif'),
    path('singleplayer/', views.singleplayer, name='singleplayer'),
    path('singleplayer/roundEnd/', views.roundEnded, name='roundended'),
    path('results/', views.results, name='results'),
]
