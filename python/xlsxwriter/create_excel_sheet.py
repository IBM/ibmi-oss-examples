import pyodbc
import argparse
import os

from xlsxwriter import Workbook
from dotenv import load_dotenv

load_dotenv()

def get_connection_string():
    connection_string = "DSN=*LOCAL"

    if os.getenv("DSN"):
        connection_string = f"DSN={os.getenv('DSN')}"

    if os.getenv("DB_USER"):
        connection_string += f"DRIVER=IBM i Access ODBC Driver;UID={os.getenv('DB_USER')};"

        if not os.getenv("DB_PASS"):
            raise Exception("Database user was provided without a password")

        connection_string += f"PWD={os.getenv('DB_PASS')};SYSTEM={os.getenv('DB_HOST', 'localhost')};"

    return connection_string

conn = pyodbc.connect(get_connection_string())
cur = conn.cursor()
cur.execute("SELECT CUSNUM, LSTNAM, BALDUE, CDTLMT FROM QIWS.QCUSTCDT")

file_name = "Customers.xlsx"

with Workbook(file_name) as workbook:
    worksheet = workbook.add_worksheet("Customers")
    headers = [descr[0] for descr in cur.description]
    worksheet.write_row("A1", headers)

    for row, data in enumerate(cur, start=1):
        worksheet.write_row(row, 0, data)

print(f"Succssfully wrote {file_name}")

