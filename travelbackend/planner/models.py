from django.contrib.auth.models import User
from django.db import models

class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    distance_km = models.FloatField()
    estimated_cost = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source} → {self.destination}"
    
class Package(models.Model):
    PACKAGE_TYPES = (
        ("road", "Road Trip"),
        ("flight", "Flight Trip"),
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.FloatField()
    type = models.CharField(max_length=20, choices=PACKAGE_TYPES)
    min_distance = models.FloatField(default=0)
    max_distance = models.FloatField(default=100000)

    def __str__(self):
        return f"{self.title} - ₹{self.price}"
    
class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    package = models.ForeignKey(Package, on_delete=models.CASCADE)
    amount = models.FloatField()
    status = models.CharField(max_length=50, default="Pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.package.title}"

