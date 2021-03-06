# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-07-24 02:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='addonTasksTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200, null=True)),
                ('auctioneerRequired', models.BooleanField()),
                ('stagingRequired', models.BooleanField()),
                ('chemicalReportRequired', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='eventLogTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200, null=True)),
                ('eventDetail', models.CharField(max_length=300, null=True)),
                ('Date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='listingTasksTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200, null=True)),
                ('lawyerRequired', models.BooleanField()),
                ('tradeMeListing', models.BooleanField()),
                ('hostAssigned', models.BooleanField()),
                ('photosTaken', models.BooleanField()),
                ('yardSaleSign', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='propertyTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=200, null=True)),
                ('propertyAddress', models.CharField(max_length=200, null=True)),
                ('propertyImage', models.ImageField(upload_to=b'')),
                ('houseInArea1', models.CharField(max_length=200, null=True)),
                ('houseInArea2', models.CharField(max_length=200, null=True)),
                ('govtValuation', models.CharField(max_length=200, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Question', models.TextField(blank=True)),
                ('answered', models.NullBooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=35, null=True)),
                ('email', models.CharField(blank=True, max_length=35, null=True)),
                ('phone', models.CharField(blank=True, max_length=15, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Suggestion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('description', models.TextField(blank=True)),
                ('time_sensitive', models.BooleanField()),
                ('approved', models.BooleanField()),
            ],
        ),
    ]
