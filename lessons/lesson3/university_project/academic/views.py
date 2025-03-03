import csv
from django.http import HttpResponse
from django.db.models import Avg
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Teacher, Student, Course, Exam
from .serializers import TeacherSerializer, StudentSerializer, CourseSerializer, ExamSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filterset_fields = ['department']
    
    @action(detail=True, methods=['get'])
    def courses_csv(self, request, pk=None):
        """
        Endpoint to get a CSV of courses taught by a given lecturer
        """
        teacher = self.get_object()
        courses = teacher.courses.all()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{teacher.last_name}_courses.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Code', 'Title', 'Description', 'Credits'])
        
        for course in courses:
            writer.writerow([course.code, course.title, course.description, course.credits])
            
        return response
    
    @action(detail=True, methods=['get'])
    def grade_average(self, request, pk=None):
        """
        Calculate the grade point average per lecturer
        """
        teacher = self.get_object()
        avg_grade = Exam.objects.filter(course__teacher=teacher).aggregate(avg=Avg('grade'))
        
        return Response({
            'teacher': f"{teacher.first_name} {teacher.last_name}",
            'average_grade': avg_grade['avg'] or 0
        })

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filterset_fields = ['courses']
    
    @action(detail=True, methods=['get'])
    def grade_average(self, request, pk=None):
        """
        Calculate the grade point average per student
        """
        student = self.get_object()
        avg_grade = Exam.objects.filter(student=student).aggregate(avg=Avg('grade'))
        
        return Response({
            'student': f"{student.first_name} {student.last_name}",
            'average_grade': avg_grade['avg'] or 0
        })


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filterset_fields = ['teacher', 'code']
    
    @action(detail=True, methods=['get'])
    def students_csv(self, request, pk=None):
        """
        Endpoint to get a CSV of students who have taken a given course
        """
        course = self.get_object()
        students = Student.objects.filter(exams__course=course).distinct()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{course.code}_students.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Student ID', 'First Name', 'Last Name', 'Email'])
        
        for student in students:
            writer.writerow([student.id, student.first_name, student.last_name, student.email])
            
        return response
    
    @action(detail=True, methods=['get'])
    def grade_average(self, request, pk=None):
        """
        Calculate the grade point average per course
        """
        course = self.get_object()
        avg_grade = Exam.objects.filter(course=course).aggregate(avg=Avg('grade'))
        
        return Response({
            'course': course.title,
            'average_grade': avg_grade['avg'] or 0
        })
    
    @action(detail=True, methods=['get'])
    def participant_count(self, request, pk=None):
        """
        Calculate the number of participants in a course
        """
        course = self.get_object()
        count = Student.objects.filter(exams__course=course).distinct().count()
        
        return Response({
            'course': course.title,
            'participant_count': count
        })


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filterset_fields = ['student', 'course', 'date']