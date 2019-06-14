from django.http import HttpResponse
from django.shortcuts import render
import datetime

def hello(request):
    return HttpResponse("Hello world")

def time(request):
    now = datetime.datetime.now()
    return render(request, 'time.html', {'current_date': now, 'current_section': 'US'})

def hours(request, hour):
    try:
        hour = int(hour)
    except ValueError:
        raise Http404()
    dt = datetime.datetime.now() + datetime.timedelta(hours=hour)
    html = "<html><body>In %s hour(s), it will be %s.</body></html>" % (hour, dt)
    return HttpResponse(html)
