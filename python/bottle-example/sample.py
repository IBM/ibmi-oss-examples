#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bottle import request, get, post, static_file, route, run, template
import ibm_db_dbi as dbi
from itoolkit import *
from itoolkit.db2.idb2call import *     #for local jobs

version = tuple(map(int, dbi.__version__.split('.')))
if version < (2, 0, 5, 5):
    raise Exception("Need ibm_db_dbi 2.0.5.5 or higher to run, you have " + dbi.__version__)

@route('/sample')
def sample():
    return static_file('sample.html', root='.') 

@route('/query', method='POST')
def query_ibm_db():
    statement = request.forms.get('sql')

    conn = dbi.connect()
    cur = conn.cursor()
    cur.execute(statement)
    
    headers = [descr[0] for descr in cur.description]

    return template('query', headers=headers, rows=cur)


@route('/cmd', method='POST')
def cmd_toolkit():
    cl_statement = request.forms.get('cl')

    # xmlservice
    itool = iToolKit()
    itransport = iDB2Call()
    itool.add(iCmd5250(cl_statement, cl_statement))
    itool.call(itransport)
   
    # results from list   
    data = ''
    for output_outer in itool.list_out():
        for output_inner in output_outer:
            data += output_inner
    
    return template('cmd', data=data)

run(host='0.0.0.0', port=9000, debug=True, reloader=True)
