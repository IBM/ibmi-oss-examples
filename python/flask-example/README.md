# Sample Flask Application 
Python Flask example inspired by previous bottle Example from the [IBM developerWorks wiki](https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/Sample%20web%20application%20with%20Python)

This example can be used with 2 different ways of accessing DB2 on IBM i.

##  Using *ibm_db* and *itoolkit*

### Installing requisites for itoolkit access
 - **ibm_db & itoolkit:** `yum install python3-ibm_db python3-itoolkit`
 - **flask:** `pip3 install flask`

### Starting the server 
python3 ./sample.py

##  Using *odbc*

### Installing requisites for itoolkit access
 - **pyodbc** `yum install python3-pyodbc`
 - **flask:** `pip3 install flask`

### Starting the server 
python3 ./sample-odbc.py

## Accessing 
Point your web browser to http://&lt;systemname&gt;:9000/sample

![screen shot](./screenshot.png?raw=true)
