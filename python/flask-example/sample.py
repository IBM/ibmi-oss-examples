#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request
app = Flask(__name__)
import ibm_db_dbi as dbi
from itoolkit import *
from itoolkit.db2.idb2call import *     #for local jobs

version = tuple(map(int, dbi.__version__.split('.')))
if version < (2, 0, 5, 5):
    raise Exception("Need ibm_db_dbi 2.0.5.5 or higher to run, you have " + dbi.__version__)

@app.route('/sample')
def sample():
    return render_template('sample.html')

@app.route('/query', methods=['POST'])
def query_ibm_db():

    statement = request.form.get('sql')
    conn = dbi.connect()
    cur = conn.cursor()
    cur.execute(statement)
    
    headers = [descr[0] for descr in cur.description]
    
    return render_template('query.html', headers=headers, rows=cur)


@app.route('/cmd', methods=['POST'])
def cmd_toolkit():
    cl_statement = request.form.get('cl')
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
    
    return render_template('cmd.html', data=data)

app.debug = True
app.run(host='0.0.0.0', port=9000,)
