# Sample Google Maps with DB2 Data Application 
This example shows how to use Db2 customer data with Google Maps APIs.

In the example, a list of customers and their addresses are retrieved from DB2. 
For each customer's address, the latitude and longitude are determined from their
address using Google Maps geocode API.  Then the addresses are plotted on a map
using Google Maps scatter API.  The points on the map are listed with the 
customer number.  The hover text for the points show the customer name. The map
is saved as gmplotwithdb2data.html.

# Google Maps API key
Because Google Maps API is not a free service now, you need to get an api key.
See https://developers.google.com/maps/documentation/javascript/get-api-key for 
details.

# Installing requisites
 - **gmplot:** `pip3 install gmplot`

# Generate the map 
python3 ./gmplotwithdb2data.py

# Screenshot
![screen shot](./screenshot.png?raw=true)
