from django.http import HttpResponse
import csv
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Teacher, Course, Student, Enrollment, Exam
from .serializers import TeacherSerializer, CourseSerializer, StudentSerializer, ExamSerializer, EnrollmentSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .serializers import StudentEnrollmentSerializer

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class CourseViewSet(viewsets.ModelViewSet):
    # queryset = Course.objects.all()
    # docente_id = self.request.query_params.get('docente')
    # if docente_id:
    #     queryset = queryset.filter(docente__id=docente_id)
    # return queryset

    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.all()
        course_name = self.request.query_params.get('course_name', None)
        print(course_name)
        if course_name is not None:
            queryset = queryset.filter(teacher__last_name=course_name )
        return queryset
    
    @action(detail=True, methods=['get', 'post'], url_path='enroll-students')
    def enroll_students(self, request, pk=None):
        """
        GET: Mostra il form per iscrivere studenti
        POST: Processa l'iscrizione degli studenti
        """
        corso = self.get_object()
        
        if request.method == 'GET':
            serializer = StudentEnrollmentSerializer()
            return Response(serializer.data)
        
        serializer = StudentEnrollmentSerializer(data=request.data)
        if serializer.is_valid():
            student_ids = serializer.validated_data['student_ids']
            
            # Trova gli studenti esistenti con gli ID forniti
            studenti = Student.objects.filter(id__in=student_ids)
            
            # Controlla se tutti gli ID forniti esistono
            found_ids = [studente.id for studente in studenti]
            not_found_ids = [id for id in student_ids if id not in found_ids]
            
            if not_found_ids:
                return Response(
                    {"error": f"Studenti con ID {not_found_ids} non trovati"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Per ogni studente, crea un record di Esame (se non esiste già)
            esami_creati = 0
            for studente in studenti:
                esame, created = Exam.objects.get_or_create(
                    studente=studente,
                    corso=corso,
                    defaults={'data': None, 'voto': None}
                )
                if created:
                    esami_creati += 1
            
            return Response({
                "message": f"{esami_creati} studenti iscritti al corso con successo",
                "enrolled": [s.id for s in studenti]
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='enrolled-students')
    def enrolled_students(self, request, pk=None):
        """
        Lista degli studenti iscritti al corso
        """
        corso = self.get_object()
        studenti = Student.objects.filter(esami__corso=corso).distinct()
        
        serializer = StudentSerializer(studenti, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='export-studenti-csv')
    def export_studenti_csv(self, request, pk=None):
        """
        Esporta un file CSV con tutti gli studenti che hanno sostenuto esami per questo corso.
        """
        corso = self.get_object()
        
        # Ottieni gli studenti che hanno sostenuto esami per questo corso
        studenti = corso.students.all()

        print(studenti)
        
        # Prepara la risposta HTTP come file CSV
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="students_report.csv"'
        
        # Crea il writer CSV
        writer = csv.writer(response)
        
        # Scrivi l'intestazione
        writer.writerow(['Matricola', 'Nome', 'Cognome', 'Email', 'Data Nascita', 'Voto Esame', 'Data Esame'])
        
        # Scrivi i dati degli studenti
        for studente in studenti:
            # Trova l'esame di questo studente per questo corso
            try:
                esame = Exam.objects.get(studente=studente, corso=corso)
                voto = f"{esame.voto}{'L' if esame.lode else ''}"
                data_esame = esame.data
            except Exam.DoesNotExist:
                voto = "N/A"
                data_esame = "N/A"
            
            writer.writerow([
                studente.matricola,
                studente.nome,
                studente.cognome,
                studente.email,
                studente.data_nascita,
                voto,
                data_esame
            ])
        
        return response
    

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_queryset(self):
        queryset = Student.objects.all()
        course = self.request.query_params.get('course', None)
        if course is not None:
            queryset = queryset.filter(courses__name=course)
        return queryset
    
class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_queryset(self):
        queryset = Exam.objects.all()
        studente_id = self.request.query_params.get('student', None)
        corso_id = self.request.query_params.get('corso')

        if studente_id:
            queryset = queryset.filter(studente__id=studente_id)
        if corso_id:
            queryset = queryset.filter(corso__id=corso_id)
        return queryset
    
class EnrolmentViewSet(viewsets.ModelViewSet):
     queryset = Enrollment.objects.all()
     serialzer_class = EnrollmentSerializer

# from rest_framework import generics
# from .models import Teacher, Course, Student, Exam
# from .serializers import TeacherSerializer, CourseSerializer, StudentSerializer, ExamSerializer

# class TeacherListCreate(generics.ListCreateAPIView):
#     queryset = Teacher.objects.all()
#     serializer_class = TeacherSerializer

# class TeacherRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Teacher.objects.all()
#     serializer_class = TeacherSerializer

# class CourseListCreate(generics.ListCreateAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class CourseRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class StudentListCreate(generics.ListCreateAPIView):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class StudentRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class ExamListCreate(generics.ListCreateAPIView):
#     queryset = Exam.objects.all()
#     serializer_class = ExamSerializer

# class ExamRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Exam.objects.all()
#     serializer_class = ExamSerializer
