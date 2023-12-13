from django.apps import AppConfig


class TomaDeRamosAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'toma_de_ramos_app'

    # def ready(self):
    #     from . import cargar_ramos
    #     cargar_ramos.cargar_ramos()