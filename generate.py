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

with open("time_series_19-covid-Confirmed.csv") as csvfile:
    reader = csv.reader(csvfile)
    header = reader.__next__()
    confirmed = [x for x in reader if x[1] == "Canada"]

with open("time_series_19-covid-Deaths.csv") as csvfile:
    reader = csv.reader(csvfile)
    deaths = [x for x in reader if x[1] == "Canada"]

with open("time_series_19-covid-Recovered.csv") as csvfile:
    reader = csv.reader(csvfile)
    recovered = [x for x in reader if x[1] == "Canada"]

provinces = {}

for province_line in confirmed:
    province = province_line[0]
    if province == "Province/State":
        continue
    provinces[province] = []
    for num, date in enumerate(header):
        if num <= 3:
            continue
        province_confirm = province_line[num]
        province_recovered = [x for x in recovered if x[0] == province][0][num]
        province_deaths = [x for x in deaths if x[0] == province][0][num]
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
