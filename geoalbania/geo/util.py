import pycristoforo as pyc
import requests
import json
from shapely.geometry import shape, Point
from django.contrib.staticfiles.storage import staticfiles_storage
from django.templatetags.static import static
from django.conf import settings
import os
import string
import random

count = 0
js = ""

def loadCoordinates():
    file_path = os.path.join(settings.STATIC_ROOT, r'geo\everycity.geojson')
    with open(file_path) as f:
        global js
        js = json.load(f)
    country = pyc.get_shape("Albania")
    points = []
    loc = []
    point = pyc.geoloc_generation(country, 100, "Albania")
    i = 0
    while len(points) < 50:
        lat = round(point[i]['geometry']['coordinates'][1],7)
        lon = round(point[i]['geometry']['coordinates'][0],7)
        p = Point(lon,lat)
        for feature in js['features']:
            polygon = shape(feature['geometry'])
            if polygon.contains(p):
                points.append(p)
                location = str(lat) + "," + str(lon)
                params = {"key" : "AIzaSyAPesM6wemOHMqUIG8lW6pkN1wEbyUF6pw" , "location" : location}
                response = requests.get("https://maps.googleapis.com/maps/api/streetview/metadata",params=params)
                res = json.loads(response.content)
                if res["status"] != "ZERO_RESULTS":
                    loc.append(res["location"])
        print(i)  
        if i < 99: 
            i = i + 1
        else:
            i = 0
            point = []
            point = pyc.geoloc_generation(country, 100, "Albania")
    return loc

def roomName(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def checkCoordinates():
    file_path = os.path.join(settings.STATIC_ROOT, r'geo\validPoints.txt')
    g = open(file_path, "r")
    j = 0
    points = []
    for l in g.readlines():
        if j > 8:
            j = j + 1 
            break
        if j % 2 != 0:
            j = j + 1 
            continue
        j = j + 1 
        points.append(l.rstrip("\n"))
    g.close()
    return points

def calculateDistance(distance):
    points = 4999.525 - 0.050 * distance * 1000
    round(points)
    if points > 5000:
        points = 5000
    elif points < 0:
        points = 0
    elif distance * 1000 < 501:
        points = 5000
    return int(points)