# Active Jobs Dashboard
Python script for IBM i that shows active jobs and allows sorting
using the DB2 qsys2.active_job_info() service.  

# Installing requisites
  - **ibm_db:** `yum install python39-ibm_db`
  - **bottle:** `python3.9 -m pip install bottle`

# Starting the server 
python3 ./server.py

Point your web browser to http://&lt;systemname&gt;:3333

![screen shot](./screenshot.jpg?raw=true)
