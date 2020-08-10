#!/usr/bin/env python3

import pyodbc as dbi
import argparse
from os import getenv
from xlsxwriter import Workbook
from dotenv import load_dotenv

load_dotenv()

parser = argparse.ArgumentParser(description="Command line tool to create an \
                                Excel workbook with data from Db2 for i table.")
parser.add_argument("-d", "--dsn", default=getenv("DSN"),
                    help="The DSN")
parser.add_argument("-u", "--user", default=getenv("DB_USER"),
                    help="The database user")
parser.add_argument("-p", "--password", default=getenv("DB_PASS"),
                    help="The database user\"s password")
parser.add_argument("-H", "--host", default=getenv("DB_HOST") or "localhost",
                    help="The database host server. NOTE: defaults to localhost")
parser.add_argument("-c", "--command",
                    help="SQL command to execute. If left empty you must \n\
                    specify a library and source file to execute the \n\
                    default command: Select * from <library>.<file>")
parser.add_argument("-l", "--library",
                    help="Name of the library that contains the database \n\
                    source file(s) that you wish to query")
parser.add_argument("-f", "--files", action="store", dest="fNames", type=str,
                    nargs="*", help="One or more database source files")
parser.add_argument("-o", "--output", default="IBMiSQL",
                    help="Name of the excel file to contain the output. \
                    Defaults to IBMiSQL")
parser.add_argument("-b", "--bold", action="store_true", default=False,
                    help="Turn on bold for column headings")
parser.add_argument("-i", "--italic", action="store_true", default=False,
                    help="Turn on italic for column headings")

parser.add_argument("-v", "--verbose",  action="store_true", default=False,
                    help="Logs verbose output for debug purposes")

args = parser.parse_args()


def getConnectionString():
    connectionString = "DSN=*LOCAL"

    if args.user:
        connectionString = f"DRIVER=IBM i Access ODBC Driver;UID={args.user};"

        if not args.password:
            raise Exception("Database user was provided without a password")

        connectionString += f"PWD={args.password};SYSTEM={args.host};"

    elif args.dsn:
        connectionString = f"DSN={args.dsn}"
    
    if args.verbose:
        print(f"Connection String: {connectionString}")

    return connectionString


def writeDataToExcel(args, workbook, sheetName):
    """ Write query output to Excel worksheet """
    print(f"Connecting to {args.host}")
    conn = dbi.connect(getConnectionString())
    cur = conn.cursor()
    cur.execute(args.command)
    headers = [descr[0] for descr in cur.description]
    format = workbook.add_format({"bold": args.bold, "italic": args.italic})
    worksheet = workbook.add_worksheet(sheetName)
    worksheet.write_row("A1", headers, format)
    for i, row in enumerate(cur, start=1):
        worksheet.write_row(i, 0, row)

def main(args):
    """ Validate command line arguments and build appropriate SQL query """
    print(f"{args}")

    if ".xlsx" not in args.output:
        args.output = f"{args.output}.xlsx"
    if ((args.library is None or args.fNames is None) and args.command is None):
        raise Exception("ERROR: You must specify one library and one or more database tables when using the default SQL command")
    else:
        with Workbook(args.output) as workbook:
            if args.command is not None:
                writeDataToExcel(args, workbook, "ibmidb")
            if args.library is not None and args.fNames is not None:
                for x in range(len(args.fNames)):
                    args.command = f"SELECT * FROM {args.library}.{args.fNames[x]}"
                    writeDataToExcel(args, workbook, args.fNames[x])

try:
    main(args)
    print(f"Succssfully wrote {args.output}")

except Exception as err:
    print(f"ERROR: {str(err)}")
