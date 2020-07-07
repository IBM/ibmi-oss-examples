----------------------------------------------------------------------------------------------------
--
-- Title: Bank - Setup Script
-- Author: Scott Forstie
-- Date:   June, 2020
--
-- Example to show how triggers can be placed on a table to publish transactions to a data queue
-- in JSON fomrat, which can then be processed by Apache Camel to integrate with Kafka or other
-- technologies.
----------------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------------
--
-- Setup a sample Bank - Branch Office
--
--------------------------------------------------------------------------------------------------

drop SCHEMA BRANCH_OFFICE_099 cascade ;
CREATE SCHEMA BRANCH_OFFICE_099 FOR SCHEMA BANKONOSS ;

--------------------------------------------------------------------------------------------------
--
-- Customers table
--
--------------------------------------------------------------------------------------------------

CREATE OR REPLACE TABLE BRANCH_OFFICE_099.CUSTOMERS (
CUSTOMER_ID FOR COLUMN CUSTID INTEGER GENERATED ALWAYS AS IDENTITY (
START WITH 1 INCREMENT BY 1
NO MINVALUE NO MAXVALUE
NO CYCLE NO ORDER
CACHE 20 )
,
CUSTOMER_NAME FOR COLUMN CUSTNAME VARCHAR(30) CCSID 37 NOT NULL ,
CUSTOMER_ADDRESS FOR COLUMN CUSTADDR VARCHAR(300) CCSID 37 NOT NULL ,
CUSTOMER_CITY FOR COLUMN CUSTCITY VARCHAR(30) CCSID 37 NOT NULL ,
CUSTOMER_STATE FOR COLUMN CUSTSTATE CHAR(2) CCSID 37 NOT NULL ,
CUSTOMER_PHONE FOR COLUMN CUSTPHONE CHAR(20) CCSID 37 NOT NULL ,
CUSTOMER_EMAIL FOR COLUMN CUSTEMAIL VARCHAR(30) CCSID 37 NOT NULL default 'not set' ,
CUSTOMER_TAX_ID FOR COLUMN CUSTTAXID CHAR(16) CCSID 37 NOT NULL NOT NULL default 'not set' ,
CUSTOMER_DRIVERS_LICENSE_NUMBER FOR COLUMN CUSTLIC CHAR(16) CCSID 37 NOT NULL default 'not set' ,
CUSTOMER_LOGIN_ID FOR COLUMN CUSTLOGIN VARCHAR(30) CCSID 37 NOT NULL default 'not set' ,
CUSTOMER_SECURITY_QUESTION FOR COLUMN CUSTQUERY VARCHAR(100) CCSID 37 NOT NULL default 'not set' ,
CUSTOMER_SECURITY_QUESTION_ANSWER FOR COLUMN CUSTANS VARCHAR(100) CCSID 37 NOT NULL default 'not set' ,
INSERT_TIMESTAMP FOR COLUMN WHENINS TIMESTAMP NOT NULL DEFAULT
CURRENT_TIMESTAMP IMPLICITLY HIDDEN ,
UPDATE_TIMESTAMP FOR COLUMN WHENUPD
TIMESTAMP GENERATED ALWAYS FOR EACH ROW ON UPDATE
AS ROW CHANGE TIMESTAMP NOT NULL IMPLICITLY HIDDEN ,
CONSTRAINT BRANCH_OFFICE_099.CUSTOMER_ID_PK PRIMARY KEY( CUSTOMER_ID ),
CONSTRAINT BRANCH_OFFICE_099.CUSTOMER_LOGIN_ID_UK
UNIQUE( CUSTOMER_LOGIN_ID ) ) ON REPLACE PRESERVE ROWS;
truncate BRANCH_OFFICE_099.CUSTOMERS ;
--------------------------------------------------------------------------------------------------
--
-- Accounts table
--
--------------------------------------------------------------------------------------------------
CREATE OR REPLACE TABLE BRANCH_OFFICE_099.ACCOUNTS (
ACCOUNT_ID INTEGER GENERATED ALWAYS AS IDENTITY (
START WITH 1 INCREMENT BY 1
NO MINVALUE NO MAXVALUE
NO CYCLE NO ORDER
CACHE 20 )
,
CUSTOMER_ID FOR COLUMN CUSTID INTEGER NOT NULL ,
ACCOUNT_NUMBER FOR COLUMN ACCOUNTNO VARCHAR(10) CCSID 37 NOT NULL default '0000000000',
ACCOUNT_NAME FOR COLUMN ACCOUNTNAM CHAR(50) CCSID 37 NOT NULL ,
ACCOUNT_DATE_OPENED FOR COLUMN OPENDATE DATE DEFAULT CURRENT_DATE ,
ACCOUNT_DATE_CLOSED FOR COLUMN CLOSEDATE DATE DEFAULT NULL ,
ACCOUNT_CURRENT_BALANCE FOR COLUMN ACCTBAL DECIMAL(11, 2) NOT NULL DEFAULT 0
,
INSERT_TIMESTAMP FOR COLUMN INSDATE
TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP IMPLICITLY HIDDEN ,
UPDATE_TIMESTAMP FOR COLUMN UPDDATE
TIMESTAMP GENERATED ALWAYS FOR EACH ROW ON UPDATE
AS ROW CHANGE TIMESTAMP NOT NULL IMPLICITLY HIDDEN ,
CONSTRAINT BRANCH_OFFICE_099.ACCOUNT_ID_PK PRIMARY KEY( ACCOUNT_ID ),
CONSTRAINT BRANCH_OFFICE_099.ACCOUNT_CUSTOMER_ID_FK
FOREIGN KEY( CUSTOMER_ID )
REFERENCES BRANCH_OFFICE_099.CUSTOMERS ( CUSTID )
ON DELETE RESTRICT
ON UPDATE RESTRICT ) ON REPLACE PRESERVE ROWS; 


--------------------------------------------------------------------------------------------------
--
-- Transactions table
--
----------------------------------------------------------------------------------------------------
CREATE TABLE BRANCH_OFFICE_099.TRANSACTIONS FOR SYSTEM NAME TRANS (
TRANSACTION_ID FOR COLUMN TRANSID INTEGER GENERATED ALWAYS AS IDENTITY (
START WITH 1 INCREMENT BY 1
NO MINVALUE NO MAXVALUE
NO CYCLE NO ORDER
CACHE 20 )
);

CREATE OR REPLACE TABLE BRANCH_OFFICE_099.TRANSACTIONS FOR SYSTEM NAME TRANS (
TRANSACTION_ID FOR COLUMN TRANSID INTEGER GENERATED ALWAYS AS IDENTITY (
START WITH 1 INCREMENT BY 1
NO MINVALUE NO MAXVALUE
NO CYCLE NO ORDER
CACHE 20 )
, 
ACCOUNT_ID INTEGER NOT NULL ,
TRANSACTION_TYPE FOR COLUMN TRANTYPE CHAR( 1 ) CCSID 37 NOT NULL ,
TRANSACTION_DATE FOR COLUMN TRANDATE DATE NOT NULL DEFAULT CURRENT_DATE ,
TRANSACTION_TIME FOR COLUMN TRANTIME TIME NOT NULL DEFAULT CURRENT_TIME ,
TRANSACTION_AMOUNT FOR COLUMN TRANAMT DECIMAL(11, 2) NOT NULL ,
INSERT_TIMESTAMP FOR COLUMN WHENINS TIMESTAMP NOT NULL DEFAULT
CURRENT_TIMESTAMP IMPLICITLY HIDDEN ,
UPDATE_TIMESTAMP FOR COLUMN WHENUPD
TIMESTAMP GENERATED ALWAYS FOR EACH ROW ON UPDATE
AS ROW CHANGE TIMESTAMP NOT NULL IMPLICITLY HIDDEN,
CONSTRAINT BRANCH_OFFICE_099.TRANSACTION_ID_PK PRIMARY KEY( TRANSACTION_ID ),
CONSTRAINT BRANCH_OFFICE_099.TRANSACTIONS_ACCOUNT_ID_FK
FOREIGN KEY( ACCOUNT_ID )
REFERENCES BRANCH_OFFICE_099.ACCOUNTS ( ACCOUNT_ID )
ON DELETE RESTRICT
ON UPDATE RESTRICT ) ON REPLACE PRESERVE ROWS;


----------------------------------------------------------------------------------------------------
--
-- Public and private authorizations
--
----------------------------------------------------------------------------------------------------

CL: GRTOBJAUT OBJ(BANKONOSS) OBJTYPE(*LIB) USER(*PUBLIC) AUT(*ALL);  
stop;


----------------------------------------------------------------------------------------------------
--
-- Create the data queue
--
----------------------------------------------------------------------------------------------------
cl:CRTDTAQ DTAQ(BANKONOSS/HANDOFF_DQ) MAXLEN(64000) SENDERID(*YES) SIZE(*MAX2GB) TEXT('row level changes in BANKONOSS');


create or replace variable scottf.dq_json clob(64000) ccsid 1208;

stop;


----------------------------------------------------------------------------------------------------
--
-- Triggers
--
----------------------------------------------------------------------------------------------------
create or replace trigger branch_office_099.customers_trigger
    after update or insert or delete on branch_office_099.customers
    referencing new as n old as o for each row
  when (inserting or updating or deleting)
  begin atomic
    declare operation varchar(10) for sbcs data;
    if inserting then
      set operation = 'INSERT';
    end if;
    if deleting then
      set operation = 'DELETE';
    end if;
    if updating then
      set operation = 'UPDATE';
    end if;
    if (inserting or updating) then
    set scottf.dq_json = JSON_OBJECT(KEY 'table' VALUE 'customers', KEY 'operation' VALUE operation, 
                                      KEY 'row' VALUE 
                                      JSON_OBJECT(
                                        KEY 'customer_id' VALUE n.customer_id,
                                        KEY 'customer_name' VALUE n.customer_name,
                                        KEY 'customer_address' VALUE n.customer_address,
                                        KEY 'customer_city' VALUE n.customer_city,
                                        KEY 'customer_state' VALUE n.customer_state,
                                        KEY 'customer_phone' VALUE n.customer_phone,
                                        KEY 'customer_email' VALUE n.customer_email,
                                        KEY 'customer_tax_id' VALUE n.customer_tax_id,
                                        KEY 'customer_drivers_license_number' VALUE n.customer_drivers_license_number,
                                        KEY 'customer_login_id' VALUE n.customer_login_id,
                                        KEY 'customer_security_question' VALUE n.customer_security_question,
                                        KEY 'customer_security_question_answer' VALUE n.customer_security_question_answer,
                                        KEY 'insert_timestamp' VALUE n.insert_timestamp,
                                        KEY 'update_timestamp' VALUE n.update_timestamp
                                      ));
    else 
    set scottf.dq_json = JSON_OBJECT(KEY 'table' VALUE 'customers', KEY 'operation' VALUE operation, 
                                      KEY 'row' VALUE 
                                      JSON_OBJECT(
                                        KEY 'customer_id' VALUE o.customer_id,
                                        KEY 'customer_name' VALUE o.customer_name,
                                        KEY 'customer_address' VALUE o.customer_address,
                                        KEY 'customer_city' VALUE o.customer_city,
                                        KEY 'customer_state' VALUE o.customer_state,
                                        KEY 'customer_phone' VALUE o.customer_phone,
                                        KEY 'customer_email' VALUE o.customer_email,
                                        KEY 'customer_tax_id' VALUE o.customer_tax_id,
                                        KEY 'customer_drivers_license_number' VALUE o.customer_drivers_license_number,
                                        KEY 'customer_login_id' VALUE o.customer_login_id,
                                        KEY 'customer_security_question' VALUE o.customer_security_question,
                                        KEY 'customer_security_question_answer' VALUE o.customer_security_question_answer,
                                        KEY 'insert_timestamp' VALUE o.insert_timestamp,
                                        KEY 'update_timestamp' VALUE o.update_timestamp
                                      ));    end if;
    call qsys2.send_data_queue_utf8(
        message_data       => scottf.dq_json, 
        data_queue         => 'HANDOFF_DQ',
        data_queue_library => 'BANKONOSS');
  end;
  
stop;
values scottf.dq_json;
----------------------------------------------------------------------------------------------------
--
-- Load some sample data into CUSTOMERS
--
----------------------------------------------------------------------------------------------------
delete from BRANCH_OFFICE_099.CUSTOMERS;

INSERT INTO BRANCH_OFFICE_099.CUSTOMERS
(CUSTOMER_ID,	
CUSTOMER_NAME,	
CUSTOMER_ADDRESS,	
CUSTOMER_CITY,	
CUSTOMER_STATE,	
CUSTOMER_PHONE,	
CUSTOMER_EMAIL,	
CUSTOMER_TAX_ID,	
CUSTOMER_DRIVERS_LICENSE_NUMBER,	
CUSTOMER_LOGIN_ID,	
CUSTOMER_SECURITY_QUESTION,	
CUSTOMER_SECURITY_QUESTION_ANSWER)
 VALUES(default, 'Becky Silver', 'King''s Cross Station Platform 9ï¿½',        
        'London', 'UK', '+44-1475-898-073', 'bsilver@hogwarts.edu',
        'GB999 9999 73',
        'ABCDE123456AB1AB', 'Bs1lver', 'Who has the best football team?',
        'Manchester United');
        

INSERT INTO BRANCH_OFFICE_099.CUSTOMERS
(CUSTOMER_ID,	
CUSTOMER_NAME,	
CUSTOMER_ADDRESS,	
CUSTOMER_CITY,	
CUSTOMER_STATE,	
CUSTOMER_PHONE,	
CUSTOMER_EMAIL,	
CUSTOMER_TAX_ID,	
CUSTOMER_DRIVERS_LICENSE_NUMBER,	
CUSTOMER_LOGIN_ID,	
CUSTOMER_SECURITY_QUESTION,	
CUSTOMER_SECURITY_QUESTION_ANSWER)
 VALUES(default, 'Sammie Gold', '20 Deans Yd',        
        'London', 'UK', '+44-20-7222-5152', 'seegold@westminster.org',
        'GB888 8888 11',
        'GEEE0101011CDDFE', 'sg0lden', 'Who has the best football team?',
        'Manchester City');
        

INSERT INTO BRANCH_OFFICE_099.CUSTOMERS
(CUSTOMER_ID,	
CUSTOMER_NAME,	
CUSTOMER_ADDRESS,	
CUSTOMER_CITY,	
CUSTOMER_STATE,	
CUSTOMER_PHONE,	
CUSTOMER_EMAIL,	
CUSTOMER_TAX_ID,	
CUSTOMER_DRIVERS_LICENSE_NUMBER,	
CUSTOMER_LOGIN_ID,	
CUSTOMER_SECURITY_QUESTION,	
CUSTOMER_SECURITY_QUESTION_ANSWER)
 VALUES(default, 'Roger Moore', '85 Albert Embankment',        
        'London', 'UK', '+44-99-0077-0077', 'Jbond@greatmovies.com',
        'GB888 8888 11',
        'GFFF0070077TTRED', 'james', 'Who has the best football team?',
        'Arsenal');
        

INSERT INTO BRANCH_OFFICE_099.CUSTOMERS
(CUSTOMER_ID,	
CUSTOMER_NAME,	
CUSTOMER_ADDRESS,	
CUSTOMER_CITY,	
CUSTOMER_STATE,	
CUSTOMER_PHONE,	
CUSTOMER_EMAIL,	
CUSTOMER_TAX_ID,	
CUSTOMER_DRIVERS_LICENSE_NUMBER,	
CUSTOMER_LOGIN_ID,	
CUSTOMER_SECURITY_QUESTION,	
CUSTOMER_SECURITY_QUESTION_ANSWER)
 VALUES(default, 'John Cleese', '162-168 Regent St.',        
        'London', 'UK', '+44-99-0077-0077', 'Knightswhosayni@python.org',
        'GB4444 4444 22',
        'GEEE911911911BLU', 'SirJohn', 'Who has the best football team?',
        'Shrubbery');

update BRANCH_OFFICE_099.CUSTOMERS set customer_city = upper(customer_city);
--------------------------------------------------------------------------------------------------
--
-- End - Load some sample data into CUSTOMERS
--
--------------------------------------------------------------------------------------------------
stop;
----------------------------------------------------------------------------------------------------
--
-- Load some sample data into ACCOUNTS
--
----------------------------------------------------------------------------------------------------

INSERT INTO BRANCH_OFFICE_099.ACCOUNTS
(ACCOUNT_ID,	
CUSTOMER_ID,	
ACCOUNT_NUMBER,	
ACCOUNT_NAME,	
ACCOUNT_DATE_OPENED,	
ACCOUNT_DATE_CLOSED,	
ACCOUNT_CURRENT_BALANCE,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
 VALUES(default, 1, 'CHK100112P', 'Becky''s checking account',        
        current date - 7 days, 
        NULL,
        1034.44, default, default);

INSERT INTO BRANCH_OFFICE_099.ACCOUNTS
(ACCOUNT_ID,	
CUSTOMER_ID,	
ACCOUNT_NUMBER,	
ACCOUNT_NAME,	
ACCOUNT_DATE_OPENED,	
ACCOUNT_DATE_CLOSED,	
ACCOUNT_CURRENT_BALANCE,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
 VALUES(default, 2, 'CHK100332P', 'Sammie''s checking account',        
        current date - 7 days, 
        NULL,
        5055.55, default, default);


INSERT INTO BRANCH_OFFICE_099.ACCOUNTS
(ACCOUNT_ID,	
CUSTOMER_ID,	
ACCOUNT_NUMBER,	
ACCOUNT_NAME,	
ACCOUNT_DATE_OPENED,	
ACCOUNT_DATE_CLOSED,	
ACCOUNT_CURRENT_BALANCE,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
 VALUES(default, 3, 'CHK100443O', 'Roger''s checking account',        
        current date - 7 days, 
        NULL,
        43.01, default, default);
 
INSERT INTO BRANCH_OFFICE_099.ACCOUNTS
(ACCOUNT_ID,	
CUSTOMER_ID,	
ACCOUNT_NUMBER,	
ACCOUNT_NAME,	
ACCOUNT_DATE_OPENED,	
ACCOUNT_DATE_CLOSED,	
ACCOUNT_CURRENT_BALANCE,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
 VALUES(default, 4, 'CHK100554G', 'John''s gold checking account',        
        current date - 7 days, 
        NULL,
        69054.13, default, default);
 
----------------------------------------------------------------------------------------------------
--
-- End --- Load some sample data into ACCOUNTS
--
----------------------------------------------------------------------------------------------------


----------------------------------------------------------------------------------------------------
--
-- End --- Load some sample data into TRANSACTIONS
--
----------------------------------------------------------------------------------------------------

INSERT INTO BRANCH_OFFICE_099.TRANSACTIONS
(TRANSACTION_ID,	
ACCOUNT_ID,	
TRANSACTION_TYPE,	
TRANSACTION_DATE,	
TRANSACTION_TIME,	
TRANSACTION_AMOUNT,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
  VALUES(default, 1, 'D', current date, current time, 10.00, default, default);


INSERT INTO BRANCH_OFFICE_099.TRANSACTIONS
(TRANSACTION_ID,	
ACCOUNT_ID,	
TRANSACTION_TYPE,	
TRANSACTION_DATE,	
TRANSACTION_TIME,	
TRANSACTION_AMOUNT,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
  VALUES(default, 2, 'W', current date, current time, 100.00, default, default);

INSERT INTO BRANCH_OFFICE_099.TRANSACTIONS
(TRANSACTION_ID,	
ACCOUNT_ID,	
TRANSACTION_TYPE,	
TRANSACTION_DATE,	
TRANSACTION_TIME,	
TRANSACTION_AMOUNT,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
  VALUES(default, 3, 'W', current date, current time, 5.00, default, default);

INSERT INTO BRANCH_OFFICE_099.TRANSACTIONS
(TRANSACTION_ID,	
ACCOUNT_ID,	
TRANSACTION_TYPE,	
TRANSACTION_DATE,	
TRANSACTION_TIME,	
TRANSACTION_AMOUNT,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
  VALUES(default, 4, 'W', current date, current time, 1000.00, default, default);


INSERT INTO BRANCH_OFFICE_099.TRANSACTIONS
(TRANSACTION_ID,	
ACCOUNT_ID,	
TRANSACTION_TYPE,	
TRANSACTION_DATE,	
TRANSACTION_TIME,	
TRANSACTION_AMOUNT,	
INSERT_TIMESTAMP,	
UPDATE_TIMESTAMP)
  VALUES(default, 4, 'D', current date, current time, 5055.25, default, default);

----------------------------------------------------------------------------------------------------
--
-- End --- Load some sample data into TRANSACTIONS
--
----------------------------------------------------------------------------------------------------
select *
  from qsys2.data_queue_info
  where data_queue_library = 'BANKONOSS'
        and data_queue_name = 'HANDOFF_DQ';
