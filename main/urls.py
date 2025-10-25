from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('insights/', views.insights, name='insights'),
    path('about/', views.about, name='about'),
    path('careers/', views.careers, name='careers'),
    path('contact/', views.contact, name='contact'),
    path('markets/', views.markets, name='markets'),
    path('news/', views.news, name='news'),
    path('services/', views.services, name='services'),
    path('home/', views.home, name='home'),
    path('search/', views.search, name='search'),
]
