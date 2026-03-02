from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, TripViewSet
from .views import get_packages,create_booking
from .views import create_admin


router = DefaultRouter()
router.register("trips", TripViewSet, basename="trips")

urlpatterns = [
    path("create-admin/", create_admin),

    path("register/", RegisterView.as_view()),
    path("packages/", get_packages),
    path("book/", create_booking),

]

urlpatterns += router.urls
