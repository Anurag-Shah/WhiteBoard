#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import threading

def main():
    """Run administrative tasks."""
    sys.path.insert(1, os.path.abspath("API"))
    sys.path.insert(1, os.path.abspath("../Compiler"))
    sys.path.insert(1, os.path.abspath("../OCR"))
    import prune_containers     # Cant move this import outside because of path
                                # If you want, can move that file from ../Compiler to this dir
                                # Really doesn't matter, python doesnt care where you import
                                # Its just convention to do it at the top of the file
                                # Or important if there are multiple functions
    threading.Thread(target=prune_containers.prune, args=(600,)).start()
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WhiteBoardBackEnd.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
