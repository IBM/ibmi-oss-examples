#!/usr/bin/env python3

#
# You will need to implement the following requisites for this application to
# function:
# - Install xlsxwriter via command: pip3 install xlsxwriter
# - Install ibm_db 2.0.5.5 or higher via PTF(s) SI61963 and SI61964
#
from xlsxwriter import Workbook
import ibm_db_dbi as dbi
import argparse

parser = argparse.ArgumentParser(description="Implement SQL from IBM i \n\
                                 command line and direct output to an \n\
                                 Excel spreadsheet.")
parser.add_argument('-c', '--c',
                    help='SQL command to execute. If left empty you must \n\
                    specify a library and source file to execute the \n\
                    default command: Select * from <library>.<file>')
parser.add_argument('-l', '--l',
                    help='Name of the library that contains the database \n\
                    source file(s) that you wish to query')
parser.add_argument('-f', '--f', action='store', dest='fNames', type=str,
                    nargs='*', help='One or more database source files')
parser.add_argument('-o', '--o', default="IBMiSQL",
                    help='Name of the excel file to contain the output')
parser.add_argument('-b', '--b', type=bool, default=False,
                    help='Turn on bold for column headings')
parser.add_argument('-i', '--i', type=bool, default=False,
                    help='Turn on italic for column headings')

args = parser.parse_args()


def writeDataToExcel(args, workbook, sheetName):
    """ Write query output to Excel worksheet """
    try:
        conn = dbi.connect()
        cur = conn.cursor()
        cur.execute(args.c)
        headers = [descr[0] for descr in cur.description]
        format = workbook.add_format({'bold': args.b, 'italic': args.i})
        worksheet = workbook.add_worksheet(sheetName)
        worksheet.write_row('A1', headers, format)
        for i, row in enumerate(cur, start=1):
            worksheet.write_row(i, 0, row)
    except Exception as err:
        print('ERROR:  ' + str(err))


def main(args):
    """ Validate command line arguments and build appropriate SQL query """
    if ".xlsx" not in args.o:
        args.o = args.o + ".xlsx"
    if ((args.l is None or args.fNames is None) and args.c is None):
        print('ERROR: You must specify one library and one or more database tables when using the default SQL command')
    else:
        with Workbook(args.o) as workbook:
            if args.c is not None:
                writeDataToExcel(args, workbook, "ibmidb")
            if args.l is not None and args.fNames is not None:
                for x in range(len(args.fNames)):
                    args.c = "Select * From " + args.l + "." + args.fNames[x]
                    writeDataToExcel(args, workbook, args.fNames[x])

main(args)
