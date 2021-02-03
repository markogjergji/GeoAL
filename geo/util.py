from django.conf import settings
import os
import random
import linecache
from django.contrib.staticfiles import finders



def checkCoordinates():
    file_path = finders.find('geo/validPoints.txt')
    g = open(file_path, "r")
    i = 0
    points = []
    while i < 5:
        line = linecache.getline(file_path, random.randint(1, 14042))
        points.append(line.rstrip("\n"))
        i = i + 1
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
