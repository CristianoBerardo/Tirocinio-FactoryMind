from django.http import HttpResponse
import csv
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import viewsets
from .models import Teacher, Course, Student, Enrollment, Exam
from .serializers import TeacherSerializer, CourseSerializer, StudentSerializer, ExamSerializer

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
    
