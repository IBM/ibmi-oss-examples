
# DBTOXLSX

Command line tool to create an XLSX file with data from Db2 for i table.

***NOTE*** This utility uses the native `ibm_db` connector to access Db2 therefore will only run locally on IBM i

## Getting Started

1) Clone the IBM i OSS examples repo and change directory into `ibmi-oss-example/python/dbtoxlsx`

    ```bash
    $ git clone https://github.com/IBM/ibmi-oss-examples.git

    $ cd ibmi-oss-examples/python/dbtoxlsx
    ```

2) Install dependencies

    ```bash
    $ ./setup.sh
    ```
    This installs the following:

    - **ibm_db:** `yum install python3-ibm_db`
    - **xlsxwriter** `pip3 install xlsxwriter`

## Example

- `./dbtoxlsx.py -c "select * From QSYS2.USER_INFO WHERE STATUS = '*ENABLED'" -o /home/test.xlsx`

## Usage
```
usage: dbtoxlsx.py [-h] [-c COMMAND] [-l LIBRARY] [-f [FNAMES [FNAMES ...]]]
                   [-o OUTPUT] [-b] [-i]

Command line tool to create an XLSX file with data from Db2 for i table.

optional arguments:
  -h, --help            show this help message and exit
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
```
