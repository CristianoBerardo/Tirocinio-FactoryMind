from django.core.management.base import BaseCommand
from students.models import Student
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Populate the database with sample student data'

    def handle(self, *args, **kwargs):
        # Clear existing data
        Student.objects.all().delete()

        # Sample data
        grades = ['A', 'B', 'C', 'D', 'F']
        
        # Create 20 students
        for i in range(1, 21):
            enrollment_date = date.today() - timedelta(days=random.randint(0, 365 * 2))
            gpa = round(random.uniform(2.0, 4.0), 2)
            
            Student.objects.create(
                name=f"Student {i}",
                email=f"student{i}@example.com",
                grade=random.choice(grades),
                gpa=gpa,
                enrollment_date=enrollment_date,
                active=random.choice([True, True, True, False])  # Mostly active
            )
            
        self.stdout.write(self.style.SUCCESS('Successfully populated students database'))