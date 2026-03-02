import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from django.http import JsonResponse
from django.contrib.auth.models import User

from rest_framework.decorators import permission_classes
from .models import Booking

from .models import Trip
from .serializers import TripSerializer, RegisterSerializer

from .models import Package
from .serializers import PackageSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registered"})
        return Response(serializer.errors, status=400)


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Trip.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Weather API
class WeatherAPIView(APIView):
    def get(self, request):
        city = request.GET.get("city")
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid=YOUR_OPENWEATHER_KEY&units=metric"
        return Response(requests.get(url).json())


# Currency API
class CurrencyAPIView(APIView):
    def get(self, request):
        frm = request.GET.get("from")
        to = request.GET.get("to")
        url = f"https://api.exchangerate-api.com/v4/latest/{frm}"
        data = requests.get(url).json()
        return Response({
            "from": frm,
            "to": to,
            "rate": data["rates"].get(to)
        })


# Country Info API
class CountryInfoAPIView(APIView):
    def get(self, request):
        country = request.GET.get("country")
        url = f"https://restcountries.com/v3.1/name/{country}"
        return Response(requests.get(url).json())

@api_view(["GET"])
def get_packages(request):
    distance = float(request.GET.get("distance", 0))
    travel_type = request.GET.get("type")

    packages = Package.objects.filter(
        type=travel_type,
        min_distance__lte=distance,
        max_distance__gte=distance
    )

    serializer = PackageSerializer(packages, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    user = request.user
    package_id = request.data.get("package_id")

    package = Package.objects.get(id=package_id)

    booking = Booking.objects.create(
        user=user,
        package=package,
        amount=package.price,
        status="Success"
    )

    return Response({"message": "Payment successful"})

