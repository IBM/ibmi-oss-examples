#!/usr/bin/env python3
import argparse

# To install necessary prerequisites:
# - Make sure you have installed 5733OPS PTF SI59051, SI60563, and SI61963 (or subsequent PTF's)!
#   See https://www.ibm.com/developerworks/community/wikis/home?lang=en#!/wiki/IBM%20i%20Technology%20Updates/page/Python%20PTFs
# - pip3 install /QOpenSys/QIBM/ProdData/OPS/Python-pkgs/ibm_db/ibm_db-*-cp34m-*.whl
# - pip3 install tabulate --user


# Using the ibm_db_dbi package instead of the ibm_db package gives you a database driver compliant with 
# Python specifications, which can be found at https://www.python.org/dev/peps/pep-0249/
import ibm_db_dbi as dbi  

import platform
import sys
from tabulate import tabulate # pip3 install tabulate --user


if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='Display netstat information.')
    parser.add_argument('--limit', type=int,
        help='Only show X rows')
    parser.add_argument('--offset', type=int,
        help='Skip first X rows')
    parser.add_argument('--port', type=int,
        help='Look for only local port')
    args = parser.parse_args()

try:
    # The connect() with no parameters will connect to database *LOCAL. 
    # This flavor requires ibm_db 2.0.5.5, which you get via SI61963 and the 'pip3' command referenced earlier. 
    conn = dbi.connect()
    
    cur = conn.cursor()
    sql = '''
SELECT
        REMOTE_ADDRESS as RemoteAddr, REMOTE_PORT as RmtPort, REMOTE_PORT_NAME as RmtPortName,
        LOCAL_ADDRESS, LOCAL_PORT as Port, LOCAL_PORT_NAME as PortName,
        CONNECTION_TYPE as TYPE,
        TRIM(AUTHORIZATION_NAME) AS AUTH_NAME, JOB_NAME, SLIC_TASK_NAME
    FROM QSYS2.NETSTAT_JOB_INFO
    {0} -- WHERE CLAUSE
    ORDER BY LOCAL_PORT, LOCAL_ADDRESS, REMOTE_PORT,  REMOTE_ADDRESS
'''
    sql = sql.format("WHERE LOCAL_PORT = ?") if  args.port is not None else sql.format('')
    params = (args.port,) if args.port is not None else None
    if args.limit is not None:
        sql += "\n    LIMIT {0}".format(args.limit)
    if args.offset is not None:
        sql += "\n    OFFSET {0}".format(args.offset)
    
    cur.execute(sql, params)
    # One advantage to using a spec-compliant driver is that it works well with many Python modules, like tabulate(),
    # which understands what to do with a standard cursor object. https://pypi.python.org/pypi/tabulate
    print(tabulate(cur, 'keys'))
    cur.close()

except:
    print("Unexpected error:", sys.exc_info())
