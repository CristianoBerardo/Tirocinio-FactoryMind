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

class EnrollmentSerializer(serializers.ModelSerializer):
    students_id = serializers.IntegerField(source='student.student_id', read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'  

class CourseSerializer(serializers.ModelSerializer):
    teacher_first_name = serializers.CharField(source='teacher.first_name', read_only=True)
    teacher_last_name = serializers.CharField(source='teacher.last_name', read_only=True)
    # enrolled_students = StudentEnrollmentSerializer(source='students', many=True, read_only=False)
    enrolled_students = EnrollmentSerializer(source='enrollment_set', read_only=True, many=True)
   
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

# from rest_framework import serializers
# from .models import Teacher, Course, Student, Exam

# class TeacherSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Teacher
#         fields = '__all__'

# class CourseSerializer(serializers.ModelSerializer):
#     teacher = TeacherSerializer(read_only=True) #Include the full teacher data in the course.
#     teacher_id = serializers.PrimaryKeyRelatedField(queryset=Teacher.objects.all(), source='teacher', write_only=True) #Allow writing just the teacher ID.
#     class Meta:
#         model = Course
#         fields = '__all__'

# class StudentSerializer(serializers.ModelSerializer):
#     courses = CourseSerializer(many=True, read_only=True) #Include full course data on read.
#     courses_ids = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='courses', many=True, write_only=True) #Allow writing just the course ids.

#     class Meta:
#         model = Student
#         fields = '__all__'

#     def create(self, validated_data):
#         courses = validated_data.pop('courses', []) #Extract courses from validated data.
#         student = Student.objects.create(**validated_data)
#         student.courses.set(courses) #Set the courses after student creation.
#         return student

#     def update(self, instance, validated_data):
#         courses = validated_data.pop('courses', []) if 'courses' in validated_data else instance.courses.all()
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.courses.set(courses)
#         instance.save()
#         return instance

# class ExamSerializer(serializers.ModelSerializer):
#     course = CourseSerializer(read_only=True)
#     student = StudentSerializer(read_only=True)
#     course_id = serializers.PrimaryKeyRelatedField(queryset=Course.objects.all(), source='course', write_only=True)
#     student_id = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), source='student', write_only=True)

#     class Meta:
#         model = Exam
#         fields = '__all__'

#     def create(self, validated_data):
#         course = validated_data.pop('course', None)
#         student = validated_data.pop('student', None)
#         exam = Exam.objects.create(course=course, student=student, **validated_data)
#         return exam

#     def update(self, instance, validated_data):
#         course = validated_data.pop('course', instance.course)
#         student = validated_data.pop('student', instance.student)
#         for attr, value in validated_data.items():
#             setattr(instance, attr, value)
#         instance.course = course
#         instance.student = student
#         instance.save()
#         return instance