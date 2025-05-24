#!/usr/bin/env python
import os
import sys

# Garantir que o diretório do projeto esteja no sys.path
# Isso permite que o Django encontre o módulo de configuração correto.
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def main():
    # Definir o módulo de configurações do Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ocorrencias_project.settings')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Não foi possível importar Django. Certifique-se de que o Django está instalado e "
            "disponível no seu ambiente Python. Caso não tenha um ambiente virtual, execute "
            "o comando 'pip install django' para instalar o Django."
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
