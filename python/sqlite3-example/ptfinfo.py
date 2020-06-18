#!/usr/bin/env python3
import sqlite3
import timeit
import hashlib

product = "5770SS1"
vrm = "V1R1M0"
bench_iterations = 1000


def initialize(datatype):
    if datatype == "db":
        clear_all(datatype)
        conn = sqlite3.connect("ptfdata.sqlite3")
        c = conn.cursor()
        c.execute('''CREATE TABLE PTFINFO
                (ID      CHAR(10)   PRIMARY KEY NOT NULL,
                PRODUCT  CHAR(10)   NOT NULL,
                VRM      CHAR(10)   NOT NULL,
                CHECKSUM CHAR(256))''')
        print("Table PTFINFO Created.")
        # add 9999 records
        for i in range(10000, 19999):
            test_id = 'SI' + str(i)
            checksum = hashlib.sha256(test_id.encode('utf-8')).hexdigest()
            c.execute('''INSERT INTO PTFINFO (ID, PRODUCT, VRM, CHECKSUM)
                VALUES (?, ?, ?, ?)''', (test_id, product, vrm, checksum))
        print("Added 9999 records.")
        conn.commit()
        conn.close()


def add_a_record(datatype, id_number, verbose=False):
    test_id = 'SI' + str(id_number)
    checksum = hashlib.sha256(test_id.encode('utf-8')).hexdigest()
    if datatype == "db":
        conn = sqlite3.connect("ptfdata.sqlite3")
        if (conn is not None):
            c = conn.cursor()
            c.execute('''INSERT INTO PTFINFO (ID, PRODUCT, VRM, CHECKSUM)
                VALUES (?, ?, ?, ?)''', (test_id, product, vrm, checksum))
            if verbose:
                if c.rowcount > 0:
                    print("Add %s has done." % test_id)
                else:
                    print("Add %s has failed." % test_id)
            conn.commit()
            conn.close()


def find_a_record(datatype, id_number, verbose=False):
    test_id = 'SI' + str(id_number)
    if datatype == "db":
        conn = sqlite3.connect("ptfdata.sqlite3")
        if (conn is not None):
            c = conn.cursor()
            c.execute("SELECT ID FROM PTFINFO WHERE ID = ?", (test_id,))
            result = c.fetchone()
            if verbose:
                if result:
                    print("Query for %s has result." % test_id)
                else:
                    print("Not found %s." % test_id)
            conn.commit()
            conn.close()


def update_a_record(datatype, id_number, verbose=False):
    test_id = 'SI' + str(id_number)
    new_checksum = hashlib.sha256(test_id.encode('utf-8')).hexdigest()
    if datatype == "db":
        conn = sqlite3.connect("ptfdata.sqlite3")
        if (conn is not None):
            c = conn.cursor()
            c.execute("UPDATE PTFINFO SET CHECKSUM=? WHERE ID=?",
                      (new_checksum, test_id))
            if verbose:
                if c.rowcount > 0:
                    print("Updte for %s has done." % test_id)
                else:
                    print("Update not found %s." % test_id)
            conn.commit()
            conn.close()


def delete_a_record(datatype, id_number, verbose=False):
    test_id = 'SI' + str(id_number)
    if datatype == "db":
        conn = sqlite3.connect("ptfdata.sqlite3")
        if (conn is not None):
            c = conn.cursor()
            c.execute("DELETE FROM PTFINFO WHERE ID=?", (test_id,))
            if verbose:
                if c.rowcount > 0:
                    print("DELETE for %s has done." % test_id)
                else:
                    print("DELETE not found %s." % test_id)
            conn.commit()
            conn.close()


def clear_all(datatype):
    if datatype == "db":
        conn = sqlite3.connect("ptfdata.sqlite3")
        if (conn is not None):
            c = conn.cursor()
            c.execute("DROP TABLE IF EXISTS PTFINFO")
            print("Cleared table PTFINFO.")
            conn.commit()
            conn.close()


def benchmark(datatype):
    initialize(datatype)
    t0 = timeit.timeit('[func(datatype, 12345) for func in (find_a_record, delete_a_record, add_a_record, update_a_record)]',
                       globals=globals(), number=bench_iterations)
    print("Datatype %s took %f seconds to run %d times find/delete/add/update operations." %
          (datatype, t0, bench_iterations))
    clear_all(datatype)


def test(datatype):
    initialize(datatype)
    [func(datatype, 12345, True) for func in (find_a_record,
                                              delete_a_record, add_a_record, update_a_record)]
    clear_all(datatype)


if __name__ == '__main__':
    for datatype in ['db']:
        # test(datatype)
        benchmark(datatype)
