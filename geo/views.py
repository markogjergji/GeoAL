from django.shortcuts import render,redirect
from . import util
from django.http import JsonResponse
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
import json


def index(request):
    request.session['inGame'] = False
    if request.method == "POST":
        request.session['coordinates'] = util.checkCoordinates()
        data = json.loads(request.body.decode("utf-8"))
        request.session['username'] = data['username']
        request.session['rounds'] = 1
        request.session['time'] = int(data['time'])
        request.session['totalRounds'] = int(data['rounds'])
        request.session['totalPoints'] = 0
        request.session['difference'] = 60000
        request.session['inGame'] = True
        request.session['gameEnded'] = False
        return HttpResponseRedirect(reverse('singleplayer'))
    return render(request,'geo/i.html')

def dif(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        request.session['difference'] = data['difference']
    return HttpResponse('')

def singleplayer(request):
    if request.method == "POST":
        return JsonResponse({'username' : request.session.get('username'),'coordinates' : request.session.get('coordinates'),'rounds' : request.session.get('rounds'),'time' : request.session.get('time'),'difference' : request.session.get('difference'),'totalPoints' : request.session['totalPoints'],'totalRounds' : request.session['totalRounds'],'gameEnded' : request.session['gameEnded']})
    if request.session['inGame']:
        return render(request, 'geo/singleplayer.html')
    else:
        return HttpResponseRedirect(reverse('index'))

def roundEnded(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        request.session['difference'] = data['difference']
        points = util.calculateDistance(data["distance"])
        request.session['totalPoints'] += points
        if request.session['rounds'] < request.session['totalRounds']:
            request.session['rounds'] = request.session['rounds'] + 1
            return JsonResponse({'points' : points , 'round' : request.session['rounds'],'difference' : request.session['difference'],'totalPoints' : request.session['totalPoints'],'gameEnded' : request.session['gameEnded']})
        else:
            request.session['coordinates'] = util.checkCoordinates()
            request.session['rounds'] = 1
            tmp = request.session['totalPoints']
            request.session['gameEnded'] = True
            return JsonResponse({'points' : points , 'round' : request.session['rounds'],'difference' : request.session['difference'],'totalPoints' : tmp,'gameEnded' : True})

def results(request):
    if request.method == "POST":
        request.session['inGame'] = True
        return HttpResponse('')
    else:
        if request.session['inGame']:
            context = {
                'totalPoints' : request.session['totalPoints'],
                'totalRounds' : request.session['totalRounds']
            }
            request.session['inGame'] = False
            request.session['coordinates'] = util.checkCoordinates()
            request.session['rounds'] = 1
            request.session['totalPoints'] = 0
            request.session['gameEnded'] = False
            return render(request,'geo/gameEnded.html',context)
        else:
            return HttpResponseRedirect(reverse('index'))
