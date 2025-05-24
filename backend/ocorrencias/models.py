# crimes/models.py

from django.db import models

class Ocorrencia(models.Model):
    municipio = models.CharField(max_length=100)
    bairro = models.CharField(max_length=100)
    tipo_crime = models.CharField(max_length=100)
    descricao = models.TextField()
    localizacao = models.PointField()  # Usando o tipo PointField para armazenar coordenadas geográficas
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Ocorrência {self.id} - {self.tipo_crime} em {self.municipio}, {self.bairro}"
