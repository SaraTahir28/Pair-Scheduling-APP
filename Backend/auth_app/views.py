from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt


# Simple user endpoint
@login_required
def user_view(request):
    """
    Returns currently logged-in user's info.
    If not logged in, will return 401 Unauthorized automatically.
    """
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