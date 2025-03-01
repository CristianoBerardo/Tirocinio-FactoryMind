from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Teacher(models.Model):
    teacher_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    born_date = models.DateField()

    def __str__(self):
        return f"{self.teacher_id} - {self.first_name} {self.last_name}"

    class Meta:
        ordering = ['last_name']
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'

class Course(models.Model):
    name = models.CharField(max_length=100)
    course_id = models.IntegerField(primary_key=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField('Student', through='Enrollment')
    credits = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.course_id} - {self.name}"
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

class Student(models.Model):
    student_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    born_date = models.DateField()
    # courses = models.ManyToManyField(Course, through='Enrollment')

    def __str__(self):
        return f"{self.student_id} - {self.first_name} {self.last_name}"
    
    class Meta:
        ordering = ['last_name']
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateField()
    
    class Meta:
        unique_together = ['student', 'course']
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'

class Exam(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    exam_date = models.DateField()
    grade = models.PositiveSmallIntegerField(validators=[MinValueValidator(18), MaxValueValidator(32)])

    def __str__(self):
        voto_str = f"{self.voto}{'L' if self.grade == 32 else ''}"
        return f"{self.studente} - {self.corso}: {voto_str}"

    class Meta:
        unique_together = ['student', 'course']
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
