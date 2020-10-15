# PostgreSQL Installation and Basic Configuration on IBM i

The purpose of this document is to summarize PostgreSQL installation and basic configuration on IBM i. The following topics are outlined below: initial setup, enabling remote connections, server startup, and connecting with a client.

## Initital Setup

Install the `postgres12-server` and `postgresql-contrib` rpm packages using the [IBM i ACS Open Source Package Management](https://www.ibm.com/support/pages/node/706903) wizard or an SSH shell session with:

```bash
$ yum install postgresql12-server postgresql12-contrib
```

According to the [PostgreSQL docs](https://www.postgresql.org/docs/12/postgres-user.html), "It is advisable to run PostgreSQL under a separate user account. This user account should only own the data that is managed by the server, and should not be shared with other daemons. The user name postgres is often used but you can use another name if you like."

From a 5250 session create a ***POSTGRES*** user profile with:

```
CRTUSRPRF  USRPRF(POSTGRES)  PASSWORD(...)
```
***NOTE:*** Creating a user profile requires `*ALLOBJ` authority.

Next create the `postgres` home directory and change ownership to the ***POSTGRES*** user. From SSH or QSH session run:

```sh
$ mkdir /home/postgres
$ chown postgres /home/postgres
```
***NOTE:*** Creating a directory under `/` requires `*ALLOBJ` authority.

Log in to your IBM i via SSH as the **POSTGRES** user.

If not started, start the bash shell by typing ***bash*** unless bash is already your default shell.

Run the following commands to initialize PostgreSQL database in the `/home/postgres` IFS directory location

```bash

$ export PGDATA=/home/postgres

$ initdb -E UTF-8 -D /home/postgres -W -A scram-sha-256
```

You will be prompted to `Enter new superuser password` for the **POSTGRES** user.

***NOTE:*** This password is for the database and distinct from the **POSTGRES** user profile.

After running `initdb` you should see the following message:
```
Success. You can now start the database server using:
    pg_ctl -D /home/postgres -l logfile start
```

## Server Startup

Run the following command to start PostgreSQL database server.

```bash
$ pg_ctl -D /home/postgres -l logfile start
```

You should see the following messages:
```
waiting for server to start.... done
server started
```

The following command can be used to stop the server.
```bash
$ pg_ctl -D /home/postgres -l logfile stop
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

From a 5250 session, run `NETSTAT *CNN` to verify the server is listening on port 5432. You should see an entry for Local Port 5432 which tells you the server is listening for connections.
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

From shell command line, create example pdatabase with the following command:

## Connect Client To the Server

The `psql` command line client is a frontend to interact with PostgreSQL server backend.
Lets use `psql` to connect to the server, create a database, create a table, insert data, and view the data.

```
$ psql
Password for user postgres:
postgres=# CREATE DATABASE us_states;
CREATE DATABASE

postgres=# \c us_states;
You are now connected to database "us_states" as user "postgres".

us_states=# CREATE TABLE States(id SERIAL, name varchar(50));
CREATE TABLE

us_states=# INSERT INTO States(name) VALUES('Alabama');
INSERT 0 1

us_states=# SELECT * FROM States;
 id |  name   
----+---------
  1 | Alabama
(1 row)

us_states=# \q
```

If you enabled remote connections, the same can be done using `psql` from a remote machine with:

```
$ psql -h myhost.example.com -U postgres -d us_states
Password for user postgres: 

us_states=# INSERT INTO States(name) VALUES('Alaska');
INSERT 0 1
us_states=# SELECT * FROM States;
 id |  name   
----+---------
  1 | Alabama
  2 | Alaska
(2 rows)

us_states=# \q
```

Alternatively you can use a GUI client like pgAdmin, Heidi, DBeaver, etc to connect to Postgres server instead of `psql`.

```
Host: IBMi host name or IP
Port: 5432
User: postgres
Password: Your password
Database: us_states
```

## Enable Remote Connections

By default PostgreSQL only listens for client connections from localhost. To allow remote connection we need to configure some files.

***NOTE:*** [Secure connections with SSL](https://www.postgresql.org/docs/12/ssl-tcp.html#SSL-SETUP) if your server is accessible publicly. In this example the server protected behind a firewall.

Before editing the configuration files make sure the PostgreSQL server is stopped with

```bash
$ pg_ctl -D /home/postgres -l logfile stop
```

Use nano, vim or some other editor to edit ***/home/postgres/postgresql.conf*** file so the server will listen on TCP/IP addresses. We will enable access on all IP addresses

```
# listen_addresses = 'localhost'
listen_addresses = '*'
```
***NOTE:*** This will allow PostgreSQL server to listen for all IP addresses.

Read the [docs](https://www.postgresql.org/docs/12/runtime-config-connection.html) for more details on Connection configuration.

Edit the `IPv4 local connections` line in ***/home/postgres/pg_hba.conf***

```
# IPv4 local connections:
# TYPE    DATABASE        USER            ADDRESS                 METHOD
# host    all             all             127.0.0.1/32            scram-sha-256
  host    all             all             0.0.0.0/0               scram-sha-256
```

Read the [docs](https://www.postgresql.org/docs/12/auth-pg-hba-conf.html) for more
details on ***pg_hba.conf*** configuration.

***NOTE:*** This will allow clients from any IPv4 address to authenticate.

Start the PostgreSQL server with:

```bash
$ pg_ctl -D /home/postgres -l logfile stop
```

Now that you have postgresql installed and setup refer to to the standard [PostgreSQL documentation](https://www.postgresql.org/docs/) as needed.
