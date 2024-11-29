# Generated by Django 5.1.3 on 2024-11-29 20:24

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('BookingId', models.AutoField(primary_key=True, serialize=False)),
                ('UserEmail', models.EmailField(default='fahad@gamil.com', max_length=100)),
                ('DestinationId', models.CharField(max_length=100)),
                ('Departure', models.CharField(max_length=100)),
                ('BookingDate', models.DateField(auto_now_add=True)),
                ('TravelDate', models.DateField()),
                ('Status', models.CharField(default='Pending', max_length=20)),
                ('Tickets', models.IntegerField()),
                ('Price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Destination',
            fields=[
                ('DestinationId', models.AutoField(primary_key=True, serialize=False)),
                ('Name', models.CharField(max_length=100)),
                ('Region', models.CharField(max_length=100)),
                ('Location', models.CharField(max_length=100)),
                ('Latitude', models.FloatField(blank=True, null=True)),
                ('Longitude', models.FloatField(blank=True, null=True)),
                ('GoogleMapsLink', models.URLField(blank=True, max_length=100, null=True)),
                ('Price', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('MaxTravellers', models.IntegerField(blank=True, null=True)),
                ('StartDate', models.DateField(blank=True, null=True)),
                ('EndDate', models.DateField(blank=True, null=True)),
                ('Nights', models.IntegerField(default=0)),
                ('Days', models.IntegerField(default=0)),
                ('Image', models.ImageField(blank=True, null=True, upload_to='')),
            ],
        ),
        migrations.CreateModel(
            name='Wishlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.EmailField(default='user@gmail.com', max_length=191)),
                ('des', models.IntegerField(default=0)),
                ('added_on', models.DateTimeField(default=api.models.get_default_added_on)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('name', models.CharField(max_length=255)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('gender', models.CharField(blank=True, max_length=10, null=True)),
                ('phone_num', models.CharField(blank=True, max_length=15, null=True)),
                ('dob', models.DateField(blank=True, null=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
