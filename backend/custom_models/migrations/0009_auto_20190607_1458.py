# Generated by Django 2.1.7 on 2019-06-07 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('custom_models', '0008_auto_20190607_1435'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='birth_date',
            field=models.CharField(max_length=10, verbose_name='DOB (DD/MM/---Y)'),
        ),
    ]
