"""
URL configuration for university_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .academic.views import EnrolmentViewSet, TeacherViewSet, CourseViewSet, StudentViewSet, ExamViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'teachers', TeacherViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'students', StudentViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'enrolment', EnrolmentViewSet)
# from .views import StudentiByCorsoCsvView
urlpatterns = [
    # ... url esistenti ...
    # path('api/corsi/<int:corso_id>/studenti-csv/', StudentiByCorsoCsvView.as_view(), name='corso-studenti-csv'),
    path('api/', include(router.urls)),
]

# from django.urls import path
# from . import views
# urlpatterns = [
#     path('teachers/', views.TeacherListCreate.as_view()),
#     path('teachers/<int:pk>/', views.TeacherRetrieveUpdateDestroy.as_view()),
#     path('courses/', views.CourseListCreate.as_view()),
#     path('courses/<int:pk>/', views.CourseRetrieveUpdateDestroy.as_view()),
#     path('students/', views.StudentListCreate.as_view()),
#     path('students/<int:pk>/', views.StudentRetrieveUpdateDestroy.as_view()),
#     path('exams/', views.ExamListCreate.as_view()),
#     path('exams/<int:pk>/', views.ExamRetrieveUpdateDestroy.as_view()),
# ]
