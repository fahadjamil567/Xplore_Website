# Generated by Django 5.1.3 on 2024-12-03 18:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_feedback_destinationname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feedback',
            name='destinationName',
        ),
    ]
