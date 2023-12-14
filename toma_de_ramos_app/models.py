from django.db import models

# Create your models here.
class tablaRamos(models.Model):
    PERIODO = models.IntegerField()
    PLAN_DE_ESTUDIOS = models.CharField(max_length=100)
    ESCUELA = models.CharField(max_length=100)
    NRC = models.IntegerField()
    CONECTOR_LIGA = models.CharField(max_length=100, blank=True, null=True)
    LISTA_CRUZADA = models.CharField(max_length=100, blank=True, null=True)
    MATERIA = models.CharField(max_length=100)
    CURSO = models.IntegerField()
    SECCION = models.CharField(max_length=10)
    TITULO = models.CharField(max_length=100)
    CREDITO = models.IntegerField()
    LUNES = models.CharField(max_length=100, blank=True, null=True)
    MARTES = models.CharField(max_length=100, blank=True, null=True)
    MIERCOLES = models.CharField(max_length=100, blank=True, null=True)
    JUEVES = models.CharField(max_length=100, blank=True, null=True)
    VIERNES = models.CharField(max_length=100, blank=True, null=True)
    SABADO = models.CharField(max_length=100, blank=True, null=True)
    DOMINGO = models.CharField(max_length=100, blank=True, null=True)
    INICIO = models.CharField(max_length=100, blank=True, null=True)
    FIN = models.CharField(max_length=100, blank=True, null=True)
    TIPO = models.CharField(max_length=10)
    PROFESOR = models.CharField(max_length=100, blank=True, null=True)
    SALA = models.CharField(max_length=10, blank=True, null=True)

    