from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from functools import wraps


def login_required_json(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Unauthorized"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

@login_required_json
def user_view(request):
   
    return JsonResponse({
        "id": request.user.id,
        "email": request.user.email or "",
        "name": request.user.get_full_name() or request.user.username,
        "role": request.user.role,
        "status": request.user.status,
    })
@csrf_exempt
def logout_view(request):
    if request.method == "POST":
        logout(request)  # clears session
        return JsonResponse({"message": "Logged out"})
    return JsonResponse({"error": "Method not allowed"}, status=405)