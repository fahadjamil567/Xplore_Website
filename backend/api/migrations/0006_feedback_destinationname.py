# Generated by Django 5.1.3 on 2024-12-03 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_rename_destination_feedback_destinationid_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedback',
            name='destinationName',
            field=models.CharField(default='', max_length=50),
        ),
    ]
