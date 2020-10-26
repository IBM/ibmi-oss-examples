using System;
using System.Data.Odbc;

// Based on Microsoft's examples at
// https://docs.microsoft.com/en-us/dotnet/api/system.data.odbc.odbcconnection?view=dotnet-plat-ext-3.1
// https://docs.microsoft.com/en-us/dotnet/api/system.data.odbc.odbcdatareader?view=dotnet-plat-ext-3.1

namespace dotnet_odbc
{
    class Program
    {
        static void Main(string[] args)
        {
            string connectionString = "DSN=mydsn;UID=Me;PWD=MyPasswordIsSecure;";
            string query = "select * from qiws.qcustcdt";

            using (OdbcConnection connection = new OdbcConnection(connectionString))
            {
                connection.Open();

                OdbcCommand command = new OdbcCommand(query);
                command.Connection = connection;

                OdbcDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    Console.WriteLine("CUSNUM = {0}, LSTNAM = {1}, INIT = {2}, STREET = {3}, CITY = {4}",
                            reader[0], reader[1], reader[2], reader[3], reader[4]);
                }
            }
        }
    }
}
