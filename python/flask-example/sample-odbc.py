#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from flask import Flask, render_template, request
app = Flask(__name__)
import pyodbc
from itoolkit import *
from itoolkit.transport import DatabaseTransport     #for local jobs

@app.route('/sample')
def sample():
    return render_template('sample.html')

@app.route('/query', methods=['POST'])
def query_ibm_db():

    statement = request.form.get('sql')
    conn = pyodbc.connect('DSN=LUGDEMO')
    cur = conn.cursor()
    cur.execute(statement)
    
    headers = [descr[0] for descr in cur.description]
    
    return render_template('query.html', headers=headers, rows=cur)


@app.route('/cmd', methods=['POST'])
def cmd_toolkit():
    cl_statement = request.form.get('cl')
    # xmlservice
    itool = iToolKit()
    conn = pyodbc.connect('DSN=LUGDEMO')
    itransport = DatabaseTransport(conn)
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
