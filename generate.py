#!/usr/bin/env python3

import csv
import os
import sys
import json
import datetime

def rewrite_date(date):
        split = date.split("/")
        month = split[0]
        day = split[1]
        year = "20" + split[2]
        return "{}-{}-{}".format(year, month, day)

os.chdir(sys.path[0])

if os.path.exists("COVID-19"):
    os.chdir("COVID-19")
    os.system("git pull")
    print("Repo updated")
else:
    os.system("git clone https://github.com/CSSEGISandData/COVID-19")
    os.chdir("COVID-19")
    print("Repo cloned")

os.chdir("csse_covid_19_data/csse_covid_19_time_series/")

with open("time_series_covid19_confirmed_global.csv") as csvfile:
    reader = csv.reader(csvfile)
    header = reader.__next__()
    confirmed = [x for x in reader if x[1] == "Canada"]

with open("time_series_covid19_deaths_global.csv") as csvfile:
    reader = csv.reader(csvfile)
    deaths = [x for x in reader if x[1] == "Canada"]

with open("time_series_19-covid-Recovered.csv") as csvfile:
    reader = csv.reader(csvfile)
    recovered = [x for x in reader if x[1] == "Canada"]

provinces = {}

def get_province_recovered(province, col):
    for line in recovered:
        if line[0] == province:
            if len(line) < col-1:
                return line[col]
            return line[-1]

def get_province_deaths(province, col):
    for line in deaths:
        if line[0] == province:
            if len(line) < col-1:
                return line[col]
            return line[-1]

for province_line in confirmed:
    province = province_line[0]
    if province == "Province/State":
        continue
    if province == "Grand Princess":
        continue
    if province == "Diamond Princess":
        continue
    if province == "Recovered":
        continue
    provinces[province] = []
    for col, date in enumerate(header):
        if col <= 3:
            continue
        province_confirm = province_line[col]
        province_recovered = get_province_recovered(province, col)
        province_deaths = get_province_deaths(province, col)
        day = {
            "date": rewrite_date(date),
            "confirmed": int(province_confirm),
            "recovered": int(province_recovered),
            "deaths": int(province_deaths),
        }
        provinces[province].append(day)

os.chdir('../../../')

if not os.path.exists("live"):
    os.makedirs("live")

with open('live/provinces.json', 'w') as f:
    print("Writing provinces.json")
    json.dump(provinces, f)

with open('live/updated.json', 'w') as f:
    now = datetime.datetime.now().isoformat()
    print("Writing updated.json")
    json.dump(now, f)
