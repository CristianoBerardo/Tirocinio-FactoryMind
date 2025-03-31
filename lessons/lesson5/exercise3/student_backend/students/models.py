from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    grade = models.CharField(max_length=2, blank=True)
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    enrollment_date = models.DateField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
