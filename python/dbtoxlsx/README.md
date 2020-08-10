
# DBTOXLSX

Python command line tool to create Excel workbook with data from Db2 for i table.

## Prerequisites

- Install Python

    On IBM i this can be installed via yum from an SSH terminal with:

    ```bash
    $ yum install python3
    ```

- Install ODBC driver and required dependencies.
    Refer to the [odbc setup guide](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md#odbc) for platform specific instrctions.

## Getting Started

1) Clone this project and change directory into `ibmi-oss-example/nodejs/exceljs`

    ```bash
    git clone https://github.com/IBM/ibmi-oss-examples.git

    cd ibmi-oss-examples/nodejs/exceljs
    ```

2) Install dependencies

   ```bash
   $ pip install -r requiremnets.txt
   ```

3) Configure `DB_HOST`, `DB_USER`, and `DB_PASS` enviorment variables within the [.env](.env) file. Or configure `DSN` environment variable to use a [DSN](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md#dsns) to connect.

# Example
- `python3 dbtoxlsx.py -h`
- `python3 dbtoxlsx.py -c "select * From QSYS2.USER_INFO WHERE STATUS = '*ENABLED'" -o /home/test.xlsx `

# Usage
```
usage: dbtoxlsx.py [-h] [-d DSN] [-u USER] [-p PASSWORD] [-H HOST]
                   [-c COMMAND] [-l LIBRARY] [-f [FNAMES [FNAMES ...]]]
                   [-o OUTPUT] [-b] [-i] [-v]

Command line tool to create an Excel workbook with data from Db2 for i table.

optional arguments:
  -h, --help            show this help message and exit
  -d DSN, --dsn DSN     The DSN
  -u USER, --user USER  The database user
  -p PASSWORD, --password PASSWORD
                        The database user"s password
  -H HOST, --host HOST  The database host server. NOTE: defaults to localhost
  -c COMMAND, --command COMMAND
                        SQL command to execute. If left empty you must specify
                        a library and source file to execute the default
                        command: Select * from <library>.<file>
  -l LIBRARY, --library LIBRARY
                        Name of the library that contains the database source
                        file(s) that you wish to query
  -f [FNAMES [FNAMES ...]], --files [FNAMES [FNAMES ...]]
                        One or more database source files
  -o OUTPUT, --output OUTPUT
                        Name of the excel file to contain the output. Defaults
                        to IBMiSQL
  -b, --bold            Turn on bold for column headings
  -i, --italic          Turn on italic for column headings
  -v, --verbose         Logs verbose output for debug purposes

```
