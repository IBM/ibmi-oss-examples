
# DBTOXLSX using Python 3 and ibm_db_dbi

Command line tool to create an XLSX file with data from Db2 for i table.

***NOTE*** This utility will only run locally on IBM i System

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
- `./dbtoxlsx.py -h`
- `./dbtoxlsx.py -c "select * From QSYS2.USER_INFO WHERE STATUS = '*ENABLED'" -o /home/test.xlsx`

## Usage
```
dbtoxlsx.py [-h] [-c C] [-l L] [-f [FNAMES [FNAMES ...]]] [-o O] [-b B] [-i I]

Implement SQL from IBM i command line and direct output to an Excel
spreadsheet.

optional arguments:
  -h, --help            show this help message and exit
  -c C, --c C           SQL command to execute. If left empty you must specify
                        a library and source file to execute the default
                        command: Select * from <library>.<file>
  -l L, --l L           Name of the library that contains the database source
                        file(s) that you wish to query
  -f [FNAMES [FNAMES ...]], --f [FNAMES [FNAMES ...]]
                        One or more database source files
  -o O, --o O           Name of the excel file to contain the output
  -b B, --b B           Turn on bold for column headings
  -i I, --i I           Turn on italic for column headings
```
