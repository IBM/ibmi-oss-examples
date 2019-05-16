#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import ibm_db_dbi as dbi
import pandas as pd
import numpy as np
import argparse
import sys
import os

def dtype_mapping():
    return {'object' : 'VARCHAR',
        'int64' : 'INT',
        'float64' : 'FLOAT',
        'datetime64' : 'DATETIME',
        'bool' : 'TINYINT',
        'category' : 'VARCHAR',
        'timedelta[ns]' : 'VARCHAR'}

def gen_tbl_cols_sql(df,keyname=''):
    dmap = dtype_mapping()
    sql=""
    df1 = df.rename(columns = {"" : "nocolname"})
    hdrs = df1.dtypes.index
    hdrs_list = [(hdr, str(df1[hdr].dtype)) for hdr in hdrs]
    for i, hl in enumerate(hdrs_list):
        fieldtype = dmap[hl[1]]
        if (fieldtype == 'VARCHAR'):
            fieldlen = str(int(np.nanmax(df1[hl[0]].str.len())))
            fieldtype = f"VARCHAR({fieldlen})"
        if (hl[0] == keyname):
            fieldtype+= " PRIMARY KEY"
        sql += "{0} {1}".format(hl[0], fieldtype)
        if (i < len(hdrs_list)-1):
            sql+=", "
    return sql

def create_db2_tbl_schema(df, conn, tbl_name,keyname=""):
    sql = F"DROP TABLE {tbl_name};"
    executesql(conn,sql)
    tbl_cols_sql = gen_tbl_cols_sql(df,keyname)
    sql = f"CREATE TABLE {tbl_name} ({tbl_cols_sql});"
    executesql(conn,sql)

def csv_to_df(infile, headers = []):
    if len(headers) == 0:
        df = pd.read_csv(infile)
    else:
        df = pd.read_csv(infile, header = None)
        df.columns = headers
    for r in range(17):
        try:
            df.rename( columns={'Unnamed: {0}'.format(r):'Unnamed{0}'.format(r)},    inplace=True )
        except:
            pass
    return df
def executesql(conn,sqlcmd):
    print(f"SQLCMD:{sqlcmd[0:500]}... ... {sqlcmd[-500:]}")
    #print(f"SQLCMD:{sqlcmd}")
    try:
        cur = conn.cursor()
        cur.execute(sqlcmd)
        cur.close()
        #conn.commit()
    except Exception as err:
        print('ERROR[SQL]:  ' + str(err))

def df_to_db2(df, conn, tbl_name):
    df1 = df.rename(columns = {"" : "nocolname"})
    hdrs = df1.dtypes.index
    sqlcmd = f"INSERT INTO {tbl_name} VALUES"
    sqlallline=""
    
    for idx in range(df.shape[0]):   
        sqlallline+=" ("
        for col in range(df.shape[1]):
            fvalue = str(df.iloc[idx,col])
            if (fvalue == 'nan'):
                fvalue = 'null'
                sqlallline+=f"{fvalue}"
            else:
                if (str(df.iloc[:,col].dtype) == 'object' ):
                    sqlallline+=" '"
                sqlallline+=f"{fvalue}"
                if (str(df.iloc[:,col].dtype) == 'object' ):
                    sqlallline+="'"
            if(col < df.shape[1] -1):
                sqlallline+=" ,"
        sqlallline+=" )"
        if(idx < df.shape[0] -1 and idx %100 != 0):
            sqlallline+=" ,"
        
        if ((idx)%100 == 0):
            sqlcmd += f" {sqlallline}"
            print(f"In tobe commit to {idx+1}/{df.shape[0]}")
            executesql(conn,sqlcmd)
            sqlcmd = f"INSERT INTO {tbl_name} VALUES"
            sqlallline="" 
    #print(f"insertCMD={sqlcmd}")
    sqlcmd += f" {sqlallline}"
    if (sqlcmd != f"INSERT INTO {tbl_name} VALUES"):
        print(f"In tobe commit to {idx+1}/{df.shape[0]}")
        executesql(conn,sqlcmd)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('csvfile',help='file to load from')
    parser.add_argument('dbname',help='Library name')
    parser.add_argument('tablename',help='table name')
    parser.add_argument('-k','--primarykey',default='',help='give a primary key column name')
    args = parser.parse_args()
    tablename = args.tablename
    csvfile = args.csvfile
    dbname = args.dbname;

    df=csv_to_df(csvfile)
    conn = dbi.connect()
    #We are using non-journal db. Change the isolation level.
    conn.set_option({ dbi.SQL_ATTR_TXN_ISOLATION:
                  dbi.SQL_TXN_NO_COMMIT })
    create_db2_tbl_schema(df,conn,f"{dbname}.{tablename}",args.primarykey)
    df_to_db2(df,conn,f"{dbname}.{tablename}")


