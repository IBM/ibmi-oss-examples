# Import gmplot library.
from gmplot import *

import ibm_db_dbi as dbi

# Generate a map from Db2 data and save it as gmplotwithdb2data.html
# The map will contain points showing customer locations from DB2

conn = dbi.connect()
cur = conn.cursor()
cur.execute("SELECT CUSNUM, LSTNAM, INIT, STREET, CITY, STATE, ZIPCOD FROM QIWS.QCUSTCDT")

cusnumvalues = []
customervalues = []
streetvalues = []
cityvalues = []
statevalues = []
zipcodevalues = []
lats = []
lons = []

# get customer data from DB2
for row, data in enumerate(cur, start=0):
    cusnumvalues.append(data[0])
    customervalues.append(str(data[2]) + ' ' + str(data[1]))
    streetvalues.append(str(data[3]))
    cityvalues.append(str(data[4]))
    statevalues.append(str(data[5]))
    zipcodevalues.append(str(data[6]))
    
# Place map
# First two arugments are the geogrphical coordinates .i.e. Latitude and Longitude
# and the zoom resolution.  Set to central United States.
gmap = gmplot.GoogleMapPlotter(38.7099886, -96.6745042, 5)
# Because google maps api is not a free service now, you need to get an api key.
# https://developers.google.com/maps/documentation/javascript/get-api-key
# your api key
gmap.apikey = "Your_API_KEY"
# determine latitude and longitude of customers
for i in range(len(zipcodevalues)):
	location = gmap.geocode(streetvalues[i]+', '+cityvalues[i]+', '+statevalues[i]+', '+zipcodevalues[i], apikey=gmap.apikey)
	lats.append(location[0])
	lons.append(location[1])
# plot locations on map
gmap.scatter(lats,lons, label=cusnumvalues, title=customervalues,color='cyan')
# Location where you want to save your file.
gmap.draw( "gmplotwithdb2data.html" )
