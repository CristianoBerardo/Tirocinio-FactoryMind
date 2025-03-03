from django.db import models

class Teacher(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=100)
    date_joined = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Course(models.Model):
    title = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    credits = models.PositiveSmallIntegerField()
    teacher = models.ForeignKey(Teacher, related_name='courses', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    courses = models.ManyToManyField(Course, related_name='students', blank=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id})"

class Exam(models.Model):
    student = models.ForeignKey(Student, related_name='exams', on_delete=models.CASCADE)
    course = models.ForeignKey(Course, related_name='exams', on_delete=models.CASCADE)
    date = models.DateField()
    grade = models.DecimalField(max_digits=4, decimal_places=2)
    
    class Meta:
        unique_together = ('student', 'course', 'date')
        
    def __str__(self):
        return f"{self.student} - {self.course} ({self.date})"