# netstat 
Python script for IBM i that provides NETSTAT information  
using DB2 QSYS2.NETSTAT_JOB_INFO service.  

# Installing requisites
 - **ibm_db:** `yum install python3-ibm_db` 
 - **tabulate:** `pip3 install tabulate --user`

# Usage examples:  
python3 netstat.py -h                     # show help  
python3 netstat.py                        # show all network services  
python3 netstat.py --limit 5 --offset 10  # show a subset based on limit 5 (how many) and offset 10 (what row to start with)  
python3 netstat.py --port 21              # show what's on smtp  
python3 netstat.py --port 80              # get info for port 80 (standard web port)  
