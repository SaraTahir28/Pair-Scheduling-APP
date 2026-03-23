from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

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
    })