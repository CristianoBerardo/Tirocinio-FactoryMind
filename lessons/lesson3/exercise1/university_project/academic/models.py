from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# -----------START CREATE NEW MODELS HERE----------------

class Student(models.Model):
    student_id = models.IntegerField(primary_key=True, auto_created=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    born_date = models.DateField()
        
    def __str__(self):
        return f"{self.student_id}"
    
    class Meta:
        ordering = ['student_id']
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

class Teacher(models.Model):
    teacher_id = models.IntegerField(primary_key=True, auto_created=True)
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
    course_id = models.IntegerField(primary_key=True, auto_created=True)
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    students = models.ManyToManyField('Student', through='Enrollment')
    credits = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.course_id} - {self.name}"
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

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

# -----------END CREATE NEW MODELS HERE----------------

# from django.db import models

# class Teacher(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     phone_number = models.CharField(max_length=20, blank=True, null=True)

#     def __str__(self):
#         return f"{self.first_name} {self.last_name}"

# class Course(models.Model):
#     title = models.CharField(max_length=200)
#     description = models.TextField(blank=True, null=True)
#     teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='courses') #A teacher can have many courses

#     def __str__(self):
#         return self.title

# class Student(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     date_of_birth = models.DateField(blank=True, null=True)
#     courses = models.ManyToManyField(Course, related_name='students') #A student can have many courses, and a course can have many students.

#     def __str__(self):
#         return f"{self.first_name} {self.last_name}"

# class Exam(models.Model):
#     course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams') #An exam belongs to a course.
#     student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='exams') #An exam belongs to a student.
#     exam_date = models.DateTimeField()
#     grade = models.DecimalField(max_digits=5, decimal_places=2)

#     class Meta:
#         unique_together = ('course', 'student', 'exam_date') #Each student can have only one exam for a specific course at a specific time.

#     def __str__(self):
#         return f"Exam for {self.student} in {self.course} on {self.exam_date}"