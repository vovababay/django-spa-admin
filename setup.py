import os
import io
from setuptools import setup, find_packages

PATH_BASE = os.path.dirname(__file__)

def read_file(fpath):
    """Reads a file within package directories."""
    with io.open(os.path.join(PATH_BASE, fpath)) as f:
        return f.read()

setup(
    name = 'django_spa_admin',
    version = '0.1.5',
    description = 'Django SPA Admin',
    long_description=read_file('README.rst'),
    author = 'Vladimir Babaev.',
    author_email = 'vladimir.babaev.12@gmail.com',


    license='MIT License',
    url = 'https://github.com/vovababay/django-spa-admin',
    packages = find_packages(),
    zip_safe=False,
    include_package_data = True,
    install_requires=[
        'Django>=4.2.0',
        'djangorestframework',
        'django-webpack-loader',
        'django-cors-headers'
    ],
    classifiers = [
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
    ]
)