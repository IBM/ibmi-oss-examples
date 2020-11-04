import matplotlib
import matplotlib.pyplot as plt
import ibm_db_dbi as dbi

matplotlib.use('AGG')

# Generate a plot from Db2 data and save it as matplotwithdb2data.png
# The plot will contain two subplots showing different Db2 data with
# various plot attributes.

conn = dbi.connect()
cur = conn.cursor()
cur.execute("SELECT CUSNUM, LSTNAM, BALDUE, CDTLMT FROM QIWS.QCUSTCDT")

xvalues = []
y1values = []
y2values = []
TITLE = 'Balance Due and Credit Limit Report'
FACECOLOUR = 'xkcd:light grey'
CUSTOMERNAME = 'Customer Name'
BALANCEDUE = 'Balance Due ($)'
CREDITLIMIT = 'Credit Limit ($)'

for row, data in enumerate(cur, start=1):
    xvalues.append(data[1])
    y1values.append(data[2])
    y2values.append(data[3])

fig_size = plt.rcParams["figure.figsize"]
fig_size[0] = 10
fig_size[1] = 8
plt.rcParams["figure.figsize"] = fig_size
plt.subplot(2,1,1)
plt.title(TITLE)
plt.bar(xvalues,y1values)
axes = plt.gca() 
axes.yaxis.grid(True)  
axes.set_facecolor(FACECOLOUR)    
axes.set_xlabel(CUSTOMERNAME)
axes.set_ylabel(BALANCEDUE)
plt.subplot(2,1,2)
plt.plot(xvalues,y2values,'bv')
axes = plt.gca() 
axes.yaxis.grid(True)  
axes.set_facecolor(FACECOLOUR)    
axes.set_xlabel(CUSTOMERNAME)
axes.set_ylabel(CREDITLIMIT)
plt.savefig('matplotwithdb2data')

