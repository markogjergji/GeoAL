from django.shortcuts import render,redirect
from . import util
from django.http import JsonResponse
from geo.tasks import load_coordinates_task
from celery.result import AsyncResult
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
import json


def index(request):
    request.session['inGame'] = False
    if request.method == "POST":
        print("INDEX POST")
        request.session['coordinates'] = util.checkCoordinates()
        data = json.loads(request.body.decode("utf-8"))
        request.session['username'] = data['username']
        request.session['rounds'] = 1
        request.session['time'] = int(data['time'])
        request.session['totalRounds'] = int(data['rounds'])
        request.session['totalPoints'] = 0
        request.session['difference'] = 60000
        request.session['inGame'] = True
        print(request.session.get('coordinates'))
        return HttpResponseRedirect(reverse('singleplayer'))
    print("INDEX GET")
    return render(request,'geo/i.html')

def dif(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        request.session['difference'] = data['difference']
    return HttpResponse('')

def singleplayer(request):
    print("SINGLEPLAYER",request.session['inGame'])
    if request.method == "POST":
        print("SINGLEPLAYER POST")
        return JsonResponse({'username' : request.session.get('username'),'coordinates' : request.session.get('coordinates'),'rounds' : request.session.get('rounds'),'time' : request.session.get('time'),'difference' : request.session.get('difference'),'totalPoints' : request.session['totalPoints'],'totalRounds' : request.session['totalRounds']})
    if request.session['inGame']:
        print(request.session['inGame'])
        print("SINGLEPLAYER GET")
        return render(request, 'geo/singleplayer.html')
    else:
        print("SINGLEPLAYER GET")
        return HttpResponseRedirect(reverse('index'))

def roundEnded(request):
    if request.method == "POST":
        print(request.session['rounds'])
        data = json.loads(request.body.decode("utf-8"))
        request.session['difference'] = data['difference']
        points = util.calculateDistance(data["distance"])
        request.session['totalPoints'] += points
        print(request.session['difference'])
        if request.session['rounds'] < request.session['totalRounds']:
            print(request.session['rounds'])
            request.session['rounds'] = request.session['rounds'] + 1
            return JsonResponse({'points' : points , 'round' : request.session['rounds'],'difference' : request.session['difference'],'totalPoints' : request.session['totalPoints'],'gameEnded' : False})
        else:
            request.session['coordinates'] = util.checkCoordinates()
            request.session['rounds'] = 1
            tmp = request.session['totalPoints']
            """ request.session['totalPoints'] = 0 """
            return JsonResponse({'points' : points , 'round' : request.session['rounds'],'difference' : request.session['difference'],'totalPoints' : tmp,'gameEnded' : True})

def results(request):
    if request.method == "POST":
        print("RESULTS POST")
        print("RESULTS BUTTON CLICKED")
        request.session['inGame'] = True
        print("RESULTS BUTTON CLICKED",request.session['inGame'])
        return HttpResponse('')
    else:
        if request.session['inGame']:
            print("RESULTS GET")
            context = {
                'totalPoints' : request.session['totalPoints'],
                'totalRounds' : request.session['totalRounds']
            }
            request.session['inGame'] = False
            request.session['coordinates'] = util.checkCoordinates()
            request.session['rounds'] = 1
            request.session['totalPoints'] = 0
            return render(request,'geo/gameEnded.html',context)
        else:
            print("RESULTS GET")
            return HttpResponseRedirect(reverse('index'))

def refresh(request):
    if request.method == "POST":
        print("refreshed")
        for key in request.session.keys():
            del request.session[key]