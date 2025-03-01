from rest_framework import serializers
from .models import Teacher, Course, Student, Enrollment, Exam

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'first_name', 'last_name']

class CourseSerializer(serializers.ModelSerializer):
    teacher_first_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    enrolled_students = StudentBasicSerializer(source='students', many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = Exam
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    exams = ExamSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = '__all__'