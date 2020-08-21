
# XlsxWriter

Python application that creates Excel worksheet with data from Db2 for i table.

## Prerequisites

- Install Python

    On IBM i this can be installed via yum from an SSH terminal with:

    ```bash
    $ yum install python3 python3-pip
    ```

- Install ODBC driver and required dependencies.
    Refer to the [odbc setup guide](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md#odbc) for platform specific instrctions.

- When installing pyodbc on IBM i, pip will download and compile the pyodbc source code. This requires that some related components and source files be available for the compile to succeed.

    ```bash
    $ yum groupinstall "Development Tools"

    $ yum install python3-devel unixODBC-devel
    ```

## Getting Started

1) Clone the IBM i OSS examples repo and change directory into `ibmi-oss-example/python/xlsxwriter`

    ```bash
    $ git clone https://github.com/IBM/ibmi-oss-examples.git

    $ cd ibmi-oss-examples/python/xlsxwriter
    ```

2) Install dependencies

   ```bash
   $ pip3 install -r requirements.txt
   ```

3) Configure `DB_HOST`, `DB_USER`, and `DB_PASS` enviorment variables within the [.env](.env) file. Or configure `DSN` environment variable to use a [DSN](https://github.com/IBM/ibmi-oss-examples/blob/master/odbc/odbc.md#dsns) to connect.

4) Run the example
    ```bash
    $ python3 create_excel_sheet.py
    ```
