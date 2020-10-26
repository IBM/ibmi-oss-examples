# Connecting to IBM i from .NET Core with ODBC

The example is self contained and should be able to be run using `dotnet run` if
the .NET Core SDK and the IBM i Access ODBC driver is installed. All that needs
to be adjusted is the connection string in the code.

The example is based off of examples from the System.Data.Odbc
documentation. It was created using the following commands:

```
dotnet new console

dotnet add package System.Data.Odbc
```
