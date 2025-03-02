from rest_framework import serializers
from .models import Teacher, Course, Student, Enrollment, Exam

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentEnrollmentSerializer(serializers.Serializer):
    student_ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Lista di ID degli studenti da iscrivere al corso"
    )

class CourseSerializer(serializers.ModelSerializer):
    teacher_first_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    # enrolled_students = StudentEnrollmentSerializer(source='students', many=True, read_only=False)
    
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