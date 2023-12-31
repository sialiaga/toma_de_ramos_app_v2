import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "toma_de_ramos_dev.settings")

import csv
from datetime import datetime
import django
django.setup()

from toma_de_ramos_app.models import tablaRamos

tablaRamos.objects.all().delete()
print("Tabla Limpiada.")

def date_format(date_string):
    date_formats = ["%d/%m/%Y", "%Y-%m-%d", "%m/%d/%Y", "%Y.%m.%d"]
    for date_format in date_formats:
        try:
            date_obj = datetime.strptime(date_string, date_format).date()
            return date_obj
        except ValueError:
            continue
    raise ValueError("Date string does not match any expected format.")


def cargar_ramos():
    print("Comenzando a subir datos...")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    ramos_csv = os.path.join(script_dir, 'ramos.csv')
    with open(ramos_csv, 'r', newline='',encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file,delimiter=',')
        for i,row in enumerate(csv_reader):
            data = row
            print("Upload", data)
            try: 
                ramo = tablaRamos(
                        PERIODO=int(data[0].lstrip('\ufeff').strip()),
                        PLAN_DE_ESTUDIOS=data[1],
                        ESCUELA=data[2],
                        NRC=data[3],
                        CONECTOR_LIGA=data[4],
                        LISTA_CRUZADA=data[5],
                        MATERIA=data[6],
                        CURSO=data[7],
                        SECCION=data[8],
                        TITULO=data[9],
                        CREDITO=data[10],
                        LUNES=data[11],
                        MARTES=data[12],
                        MIERCOLES=data[13],
                        JUEVES=data[14],
                        VIERNES=data[15],
                        SABADO=data[16],
                        DOMINGO=data[17],
                        INICIO=data[18],
                        FIN=data[19],
                        TIPO=data[20],
                        PROFESOR=data[21],
                        SALA=data[22]
                    )
                ramo.save()
            except Exception as e:
                print()
                print(f"line: {i+1}")
                print(f"Problem with: \n {data}")
                print(f"Error: {e}")
                print("Problemas para subir los datos :c")
                break
        print("Datos subidos correctamente c:")
            
if __name__ == '__main__':
    cargar_ramos()        