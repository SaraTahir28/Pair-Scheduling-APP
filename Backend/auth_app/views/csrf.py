from django.http import JsonResponse
from django.middleware.csrf import get_token

def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})
