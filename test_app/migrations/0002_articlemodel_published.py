# Generated by Django 5.1.2 on 2024-10-25 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("test_app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="articlemodel",
            name="published",
            field=models.BooleanField(default=False, verbose_name="Опубликовано"),
        ),
    ]
