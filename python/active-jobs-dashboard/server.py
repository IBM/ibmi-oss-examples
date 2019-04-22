#!/usr/bin/env python3 
from bottle import route, run, template, request
from string import capwords
import ibm_db_dbi as dbi

conn = dbi.connect(dsn=None, database='*LOCAL', \
                       user=None, password=None)
@route('/', method=('GET', 'POST'))
def root():
    reset = request.forms.get('reset') == 'true'
    reset_parm = 'YES' if reset else 'NO'
    sorting = request.forms.get('sorting') or '""'
    show_cols = (
        'JOB_NAME', 'AUTHORIZATION_NAME', 'JOB_TYPE', 'FUNCTION_TYPE',
        'FUNCTION', 'JOB_STATUS', 'ELAPSED_INTERACTION_COUNT',
        'ELAPSED_TOTAL_RESPONSE_TIME', 'ELAPSED_TOTAL_DISK_IO_COUNT',
        'ELAPSED_ASYNC_DISK_IO_COUNT', 'ELAPSED_SYNC_DISK_IO_COUNT',
        'ELAPSED_CPU_PERCENTAGE', 
        'ELAPSED_PAGE_FAULT_COUNT')
    hide_cols = ( 'ELAPSED_TIME', )
    all_cols = show_cols + hide_cols
   
    headers = [ titleize(col) for col in show_cols ]
    column_string = ', '.join(all_cols)
    
    query = "select %s from table(qsys2.active_job_info(RESET_STATISTICS => ?)) x" % column_string

    cur = conn.cursor()
    cur.execute(query, (reset_parm, ))
    
    elapsed_time = 0
    row_data = []
    
    for row in cur:
        row_data.append(row[0 : len(show_cols)])
        elapsed_time = row[-1]
    
    return template('root', rows=row_data, headers=headers, elapsed_time=elapsed_time, sorting=sorting)

def titleize(column):
    title = column.replace('_', ' ')
    return capwords(title)

@route('<path:re:/.*\.(js|css|gif)>')
def static_assets(path):
    with open(path[1:], "rb") as f:
        return f.read()

run(host='0.0.0.0', port=3333, debug=True, reloader=True)
