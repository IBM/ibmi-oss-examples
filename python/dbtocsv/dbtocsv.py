#!/usr/bin/env python3

import ibm_db_dbi as db2
from csv import writer, QUOTE_NONNUMERIC

query = "select cusnum, lstnam, init, cdtlmt from qiws.qcustcdt where cdtlmt > 100"


# Strip trailing spaces as applicable
def trim_col(s):
    return s.rstrip() if hasattr(s, 'rstrip') else s

conn = db2.connect()
cur = conn.cursor()
cur.execute(query)

with open('qcustcdt.csv', 'w', newline='') as file:
    csvf = writer(file, quoting=QUOTE_NONNUMERIC)
    for row in cur:
        csvf.writerow([trim_col(col) for col in row])
