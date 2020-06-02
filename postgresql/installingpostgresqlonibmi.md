# Install and configure Postgresql DB Server on IBM i 

Install postgres yum packages from IBM i ACS Open Source Package Management
```
Package list:
postgresql12 ***(This item may be the only one you need to select to include all packages)***
postgresql12-contrib
postgresql12-devel
postgresql12-docs
postgresql12-libecpg
postgresql12-libpgtypes
postgresql12-libpq
postgresql12-server
```

Create IBM i user: ***POSTGRES*** and give it a password. It's important the user is named POSTGRES because the Postgresql server needs a default user of POSTGRES. At least that was my experience with it. (Also give it *ALLOBJ access for now. You can probably remove later and possibly even disable the IBM i POSTGRES user. ***Not tested.***)

Log in to SSH as IBM i user ***POSTGRES*** to do server setup.

If not started, start the bash shell by typing ***bash*** unless bash is already your default shell. 

Run the following shell command line sequence to initialize postgres database in the /postgres IFS directory location
```
cd /

mkdir postgres

export PGDATA=/postgres

initdb -E UTF-8 -D /postgres
```

After initdb you should see the following message:
```
Success. You can now start the database server using:
    pg_ctl -D /postgres -l logfile start
```

***Do not start server yet until after you modify /postgres/postgresql.conf***
	
Use nano editor, vim or other editor to edit ***/postgres/postgresql.conf*** file so the server will listen on TCP/IP addresses. We will enable access on all IP addresses
```
edit /postgres/postgresql.conf
uncomment listen_addresses and and change to: listen_addresses = '*' 
uncomment the port = 5432 entry. 
save postgresql.conf
```
	
Run the following command to start postgres database server.
```
pg_ctl -D /postgres -l logfile start
```

You should see the following messages:
```
waiting for server to start.... done
server started
```

This following command can be used to stop the server.
```
pg_ctl -D /postgres -l logfile stop
```

From a 5250 session, run WRKACTJOB and you should see the active server jobs and threads in the QUSRWRK subsystem
```
--------------------------------------------------------------------------------
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
QP0ZSPWP     POSTGRES    BCI      .0  PGM-postgres     SELW
--------------------------------------------------------------------------------
```

From a 5250 session, run "NETSTAT *CNN" to verify the server is listening on port 5432. You should see an entry for Local Port 5432 which tells you the server is listening for connections. 
```
--------------------------------------------------------------------------------
                        Work with IPv4 Connection Status                   
                                                             System:   SYS1
 Type options, press Enter.                                                
   3=Enable debug   4=End   5=Display details   6=Disable debug            
   8=Display jobs                                                          
                                                                           
      Remote           Remote     Local                                    
 Opt  Address          Port       Port       Idle Time  State              
      *                *          5432       000:05:22  Listen             
--------------------------------------------------------------------------------
```

Allow remote access to server. You can change this by editing ***/postgres/pg_hba.conf*** 

Add following entry to the pg_hba.conf file:
```
host   all   all   0.0.0.0/0     password
```
Note: This will enable password checking. You'll need to set a new password for the ***postgres*** user on the Postgresql server. See below.

Save pg_hba.conf. 

Stop and then start Postgresql server as described previously. 

From shell command line, create demo postgres database using the following command line command:
```
createdb ibmidemo
```

The psql command utility can be used to provide permissions and do other server related maintenance. 

For now we will just allow access for the postgres user to our new database as an example.
We will also set a password for the postgres user. This sample uses 'postgres2020' for the password. 
You should use a more secure password. 
***NOTE: You should also review the Postgres site for appropriate Postgres security measures.***

Start psql utility
```
psql 
```

Type the following sql and press Enter to set database access for postgres database user:
```
grant all privileges on database ibmidemo to postgres;
```

Type the following sql and press Enter to set the database server password for the postgres database user:
```
alter user postgres with password 'postgres2020';
```

Type: ***quit*** and press enter to exit the psql utility.


Use Heidi, DBeaver or other Postgresql client to connect to Postgres database. 
```
Host: IBMi host name or IP
Port: 5432
User: postgres
Password: postgres2020
Database: ibmidemo
```

If desired, change the port that Postgresql server listens on to something other than 5432.

use nano editor, vim or other editor to edit ***/postgres/postgresql.conf*** file 

```
Change port number. 
Ex: port = 60432 
```

save postgresql.conf

Stop and restart Postgres server

Now refer to standard Postgresql documentation as needed. 

# Links

Postgresql Site

https://www.postgresql.org

Role postgres does not exist error

https://dba.stackexchange.com/questions/221663/psql-fatal-role-postgres-does-not-exist
