from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from bs4 import BeautifulSoup
import requests
import json
import datetime
# Create your views here.

def index(req):
	return render(req,"body.html")

def growth(req):
	data = requests.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");
	data = json.loads(data.text)["records"]
	lds=[]
	for i in data:
		if (i["countryterritoryCode"],i["countriesAndTerritories"]) not in lds:
			lds.append((i["countryterritoryCode"],i["countriesAndTerritories"]))

	return render(req,"growth.html",{"data_growth":lds})

def find_growth(c):
  a=[]
  for i in range(len(c)-1):
    a.append(abs(c[i]-c[i+1]))
  return sum(a) / len(a)

def growth_chart(req,code,days):
	data = requests.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/");
	data = json.loads(data.text)["records"]
	cases = []
	date = []
	growth = []
	avg=0
	ch=0
	maxvalue=0
	for i in data[::-1]:
		if(i["countriesAndTerritories"]==code and int(i["cases"])>0):
			ch=1

		if (i["countriesAndTerritories"]==code and ch!=0):
			cases.append(int(i["cases"]))
			date.append(i["dateRep"])
			growth.append(None)

	avg = find_growth(cases)
	growth[-1] = cases[-1]
	x = datetime.datetime(int(date[-1].split('/')[2]), int(date[-1].split('/')[1]), int(date[-1].split('/')[0]))+datetime.timedelta(days=1)
	for i in range(int(days)):
		date.append(x.strftime("%d/%m/%Y"))
		x = datetime.datetime(int(date[-1].split('/')[2]), int(date[-1].split('/')[1]), int(date[-1].split('/')[0]))+datetime.timedelta(days=1)
		cases.append(None)
		t=0
		if growth[-1]==None:
			t = cases[-2]+avg
		else:
			t = growth[-1]+avg
		t = int(t)
		if t < 0:
			t = 0
		growth.append(t)

	total=0
	for i in cases:
		if i != None:
			total+=i
	for i in growth:
		if i != None:
			total+=i

	return JsonResponse({"cases":cases,"growth":growth,"date":date,"total":f"{total:,d}"})

def report_wiki(req):
	html=requests.get("https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container")
	soup = BeautifulSoup(html.text, 'html.parser')
	data=str(soup.find(id="covid19-container").find('table'))
	first= data.rfind("<tr class=\"sortbottom\"")
	last = data.rfind("</tr>")+4
	data = data.replace(data[first:last],"")
	tr = BeautifulSoup(data, 'html.parser')
	country=[]
	total_cases=0
	total_death=0
	total_recovered=0
	for i in tr.find_all('tr')[2:-1]:
		d=[]
		for j in i.find_all('a'):
			ft=str(j).find('>')+1
			lt=str(j).rfind('<')
			j=str(j)[ft:lt]
			j=j.replace("</span>","")
			j=j.replace("<span style=\"font-size:85%;\">","")
			j=j.replace("<span style=\"font-size:90%;\">","")
			if j.count('[')!=0:
				continue
			d.append(j)
		for j in i.find_all('td'):
			j=str(j)
			if j.count('[')!=0:
				continue
			j=j.replace("\n","")
			j=j.replace("-","0")
			j=j.replace(",","")
			j=j.replace("<td>","")
			j=j.replace("</td>","")
			j=j.replace("<span style=\"color:darkgray\">\u2013</span>","0")

			d.append(j)
		if(len(d)==5):
			d=d[1:]
		if(len(d)==4):
			country.append(d[0])
			total_cases+=int(d[1])
			total_death+=int(d[2])
			total_recovered+=int(d[3])

	return render(req,"report.html",{"total_cases":f"{total_cases:,d}","total_death":f"{total_death:,d}","total_recovered":f"{total_recovered:,d}","active_cases":f"{total_cases-(total_death+total_recovered):,d}"})

def report_table_wiki(req):
	html=requests.get("https://en.wikipedia.org/wiki/2019%E2%80%9320_coronavirus_pandemic_by_country_and_territory#covid19-container")
	soup = BeautifulSoup(html.text, 'html.parser')
	data=str(soup.find(id="covid19-container").find('table'))
	#print("*******************",type(data))
	first= data.rfind("<tr class=\"sortbottom\"")
	last = data.rfind("</tr>")+4
	data = data.replace(data[first:last],"")
	tr = BeautifulSoup(data, 'html.parser')
	l=[]
	for i in tr.find_all('tr'):
		d=[]
		for j in i.find_all('a'):
			ft=str(j).find('>')+1
			lt=str(j).rfind('<')
			j=str(j)[ft:lt]
			j=j.replace("</span>","")
			j=j.replace("<span style=\"font-size:85%;\">","")
			j=j.replace("<span style=\"font-size:90%;\">","")
			if j.count('[')!=0:
				continue
			d.append(j)
		for j in i.find_all('td'):
			j=str(j)
			if j.count('[')!=0:
				continue
			j=j.replace("\n","")
			j=j.replace("-","0")
			j=j.replace(",","")
			j=j.replace("<td>","")
			j=j.replace("</td>","")
			j=j.replace("<span style=\"color:darkgray\">\u2013</span>","0")

			d.append(j)
		if(len(d)==5):
			d=d[1:]
		l.append(d)
	return JsonResponse({"data":l[2:-1]})

def report_table(req):
	html=requests.get("https://www.worldometers.info/coronavirus/#countries")
	soup = BeautifulSoup(html.text, 'html.parser')
	data=str(soup.find(id="main_table_countries_today"))
	tr = BeautifulSoup(data, 'html.parser')
	l=[]
	for i in tr.find_all('tr')[1:-1]:
		d=[]
		for j in i.find_all('td'):
			j=str(j)
			while(j.count('>')>0):
				ft=j.find('>')+1
				lt=j.rfind('<')
				j=j[ft:lt]
			j=j.replace("\n","")
			j=j.replace(",","")
			if(j=="" or j==" "):
				j="0"
			#j=j.replace("\u00a0","")
			d.append(j)
		l.append([d[0],int(d[1]),int(d[5]),int(d[3])])
	return JsonResponse({"data":l})

def report(req):
	html=requests.get("https://www.worldometers.info/coronavirus/#countries")
	soup = BeautifulSoup(html.text, 'html.parser')
	data=str(soup.find(id="main_table_countries_today"))
	tr = BeautifulSoup(data, 'html.parser')
	l=[]
	out=[]
	for i in tr.find_all('tr')[1:]:
		d=[]
		for j in i.find_all('td'):
			j=str(j)
			while(j.count('>')>0):
				ft=j.find('>')+1
				lt=j.rfind('<')
				j=j[ft:lt]
			j=j.replace("\n","")
			j=j.replace(",","")
			if(j=="" or j==" "):
				j="0"
			#j=j.replace("\u00a0","")
			d.append(j)
		l.append(d)
		if(d[0]!="Total:"):
			out.append([d[0],int(d[1]),int(d[5]),int(d[3])])

	return render(req,"report.html",{"total_cases":f"{int(l[-1][1]):,d}","total_death":f"{int(l[-1][3]):,d}","total_recovered":f"{int(l[-1][5]):,d}","active_cases":f"{int(l[-1][6]):,d}","serious_critical":f"{int(l[-1][7]):,d}","countries":out})




def India_case_prediction(days):

    #Packages
    from statsmodels.tsa.api import SimpleExpSmoothing, Holt, ExponentialSmoothing #To use Simple, Exponential and Holt Smoothing
    from statsmodels.tsa.seasonal import seasonal_decompose #To perform seasonal decompositionimport json
    import requests
    import pandas as pd
    import numpy as np
    import json
    import matplotlib.pyplot as plt
    import datetime
    from datetime import date, timedelta
    import matplotlib.dates as mdates

    # To avoid printing warnings
    import warnings
    warnings.filterwarnings("ignore")

    # Typecasting "days" to INT
    days = int(days)

    # Getting json file and converting to dataframe
    data = requests.get("https://opendata.ecdc.europa.eu/covid19/casedistribution/json/")
    data = json.loads(data.text)["records"]
    df = pd.DataFrame(data)

    # Extracting INDIA's data and making date as index of dataframe for training purpose
    India_df = df["countryterritoryCode"] == "IND"
    India_df = df[India_df]
    India_df = India_df.iloc[::-1]
    India_df.reset_index(drop=True, inplace=True)
    India_df['dateRep'] = pd.to_datetime(India_df.dateRep,format='%d/%m/%Y')
    India_df.index = India_df['dateRep']


    #Preparing training and predicition dataframes based on current date
        # Have taken from March 15, as previous days mostly had 0 cases
    CurrentDate = date.today()
    India_df_train=India_df.ix['2020-03-15' : CurrentDate - datetime.timedelta(1)]

    India_df_predict = pd.DataFrame()
    India_df_predict['dateRep'] = pd.date_range(start = CurrentDate,
                                                end = CurrentDate + datetime.timedelta(days),
                                                freq ='D')

    India_df_predict.index = India_df_predict['dateRep']



    #Holt-Winters model for prediction
    fit2 = ExponentialSmoothing(np.asarray((India_df_train['cases']).astype(str).astype(float)),
                                          seasonal_periods=7 ,trend='add', seasonal='add').fit()

    #Predicting target column for given number of days
    India_df_predict['Exp'] = fit2.forecast(days + 1)

    #Training and Predicted dataframes displayed
    print(India_df_train)
    print(India_df_predict)


    
    #Plotting graph
    plt.figure(figsize=(16, 8))
    plt.plot(India_df_train['cases'].astype(str).astype(float), color='blue', lw=2)
    plt.plot(India_df_predict['Exp'], color='orange', lw=2)
    plt.xlabel("Day_Count")
    plt.ylabel("No of cases")
    x1,x2,y1,y2 = plt.axis()
    plt.axis((x1,x2,0,250))
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%d/%m/%Y'))
    plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=5))
    plt.gcf().autofmt_xdate()
    plt.show()


#Sample call for 15 days
India_case_prediction(15)


#"$%.2f"|format(543921.9354)
