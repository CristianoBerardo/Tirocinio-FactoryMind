from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from snippets.models import Snippet
from snippets.serializer import SnippetSerializer



@csrf_exempt
def snippet_list(request):
  """
  List all code snippets, or create a new snippet.
  """
  if request.method == 'GET':
    snippets = Snippet.objects.all()
    serialized = SnippetSerializer(snippets, many=True)
    return JsonResponse(serialized.data, safe=False)
  
  elif request.method == 'POST':
    data = JSONParser().parse(request)
    serialided = SnippetSerializer(data=data)

    if serialided.is_valid():
      serialided.save()
      return JsonResponse(serialized.data, status=201)
    
    return JsonResponse(serialized.errors, status=400)
  
@csrf_exempt
def snippet_detail(request, pk):
  """
  Retrieve, update or delete a code snippet.
  """
  try:
    snippet_exists = Snippet.objects.get(pk=pk)
  except Snippet.DoesNotExist:
    return HttpResponse(status=404)
  
  if request.method == 'GET':
    serialized = SnippetSerializer(snippet_exists)
    return JsonResponse(serialized.data)
  
  elif request.method == 'PUT':
    data = JSONParser().parse(request)
    serialized = SnippetSerializer(snippet_exists, data=data)

    if serialized.is_valid():
      serialized.save()
      return JsonResponse(serialized.data)
    
    return JsonResponse(serialized.errors, status=400)