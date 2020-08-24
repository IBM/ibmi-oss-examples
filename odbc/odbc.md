# **ODBC**

Open Database Connectivity (ODBC) is a standardized API for connecting to databases that is cross-platform and cross-DBMS (Database Management System). By installing an general ODBC driver manager and a driver for your specific DBMS, the code that interacts with the ODBC API can be generalized. This makes ODBC a very powerful tool for both development and for production, as the application can be deployed on any system and talk to any DBMS as long as it has the correct drivers installed.

## **Table of Contents**

* [ODBC](#odbc)
  * [Table of Contents](#table-of-contents)
  * [Why ODBC?](#why-odbc)
* [Installation](#installation)
  * [Installation on IBM i](#installation-on-ibm-i)
    * [Driver Manager](#driver-manager)
    * [Driver](#driver)
  * [Installation on Linux](#installation-on-linux)
    * [Driver Manager](#driver-manager-1)
    * [Driver](#driver-1)
  * [Installation on Windows](#installation-on-windows)
    * [Driver Manager](#driver-manager-2)
    * [Driver](#driver-2)
  * [Installation on macOS](#installation-on-macos)
    * [Driver Manager](#driver-manager-3)
    * [Driver](#driver-3)
* [Using ODBC](#using-odbc)
  * [Connection Strings](#connection-strings)
  * [DSNs](#dsns)
    * [Configuration on Windows](#configuration-on-windows)
    * [Configuration with UnixODBC (IBM i, Linux, macOS)](#configuration-with-unixodbc-ibm-i-linux-macos)
    * [Using Your DSN](#using-your-dsn)
* [Node.js Example](#nodejs-example)
  * [Setting Up Your Development Environment](#setting-up-your-development-environment)
  * [Development](#development)
  * [Transfer to IBM i](#transfer-to-ibm-i)

## Why ODBC?

For the open-source software team, ODBC is the preferred method of connecting to Db2 on i. There are many resons for this, including:

* Because ODBC is a technology that is used for more than just IBM i, there are many applications and technologies that are already enabled to use ODBC. Nearly all open-source programming languages (and many non-open-source languages) have some way to connect to databases through an ODBC interface, facilitating interaction with any database that has an ODBC driver (including IBM i).

* Similarly, because ODBC connectors have already been developed for so many languages and frameworks, the IBM i Open-Source Software Team doesn’t have to spend time creating specific Db2 for i connectors for every new technology we deliver on the platform. This means that we can spend more time delivering new software for you and pushing what is possible on IBM i. In the future, most of the packages we develop will require that you use ODBC connections.

* As already mentioned, ODBC is useful if you want to connect to Db2 on i from off-system. Unlike CLI-based connectors, which can only be built on IBM i, ODBC connections can be created from Windows and Linux machines as well. This means that you can develop your applications on one system and then move them to IBM i when you are ready to deploy them. It also means that you can have the same application running on multiple different platforms that can all communicate with Db2 on i in the same way.

* Finally, there are many more connection options available for ODBC than on CLI. When you create an ODBC connection through a DSN or a connection string, there are approximately 70 different connection options that can be set. This includes everything from specifying the system, your username, or your password, to defining default libraries and schemas or whether or not stored procedures can be called. A full list of options can be found on the [“Connection string keywords” page of the 7.4 documentation](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_74/rzaik/connectkeywords.htm).

# **Installation**

The instructions for installing and ODBC driver and manager and the IBM i ODBC driver for Db2 on i will depend on what operating system you are running. Select your operating system below to see setup instructions for getting ODBC on your system and connected to IBM i.

* [Installation on IBM i](#installation-on-ibm-i)
* [Installation on Linux](#installation-on-linux)
* [Installation on Windows](#installation-on-windows)
* [Installation on macOS](#installation-on-macOS)

## **Installation on IBM i**

### **Driver Manager**

On IBM i, we will be using unixODBC as our driver manager. Fortunately, unixODBC is automatically pulled in when you install the IBM i Access ODBC Driver for Linux, so there isn't any set up that you have to do for this stage. If you want to develop applications using ODBC packages like pyODBC for Python or odbc for Node.js, you will have to use yum to manually install `unixODBC-devel` as well.

### **Driver**

To get both the unixODBC driver manager and the driver that allows ODBC to talk to Db2 for i, you will have to install the ODBC driver that allows your IBM i machine to use unixODBC to talk to Db2. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, select the `Download using http` tab then scroll down and download the **ACS PASE App Pkg**.  More complete instructions on how to download this driver can be found at [this TechNote on the ODBC Driver for the IBM i PASE environment](https://www-01.ibm.com/support/docview.wss?uid=ibm10885929).

When the driver has been downloaded and unzipped and transferred to your IBM i system, you can run the rpm with yum the same way you would otherwise, but giving it the location of the file instead of the name of the package:

```bash
$ yum install <package-location>/ibm-iaccess-<version>.rpm
```

This will install the Db2 ODBC driver onto your IBM i system. It will also create a driver entry in your `odbcinst.ini` and a DSN in `odbc.ini` for your local system called `*LOCAL`. This is discussed below.

## **Installation on Linux**

### **Driver Manager**

On Linux, we will be using unixODBC as our driver manager. Fortunately, unixODBC is automatically pulled in when you install the IBM i Access ODBC Driver for Linux, so there isn't any set up that you have to do for this stage. If you want to develop applications using ODBC packages like pyODBC for Python or odbc for Node.js, you will have to manually use yum to install `unixODBC-devel` as well.

### **Driver**

To get both the unixODBC driver manager and the driver that allows ODBC to talk to Db2 for i, you will have to install the IBM i Access ODBC Driver for Linux. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions Download page, select the `Download using http` tab then scroll down and download the **ACS Linux App Pkg**.

In this package, there is a README that will help explain how to install the driver with either with RPMs or DEBs, depending on your Linux distribution. Just know that when you install the driver, it should pull in all of the packages you need to create an ODBC connection to Db2 for i from your Linux system.

## **Installation on Windows**

### **Driver Manager**

Windows comes preinstalled with an ODBC driver manager. To access it, search for `Administrative Tools` on your system (either through the search bar, or `Control Panel > System and Security > AdministrativeTools`), and then from there select ODBC Data Sources (either 32-bit or 64-bit).

From this application, you can set up your drivers.

### **Driver**

You will have to install the ODBC driver that allows Windows ODBC driver manager to talk to Db2 on i. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, scroll down and download the **ACS Windows App Pkg English (64bit)**.

When the package has been downloaded and has been installed on your system, it should be available to see on your ODBC Data Source Administrator application.

## **Installation on macOS**

### **Driver Manager**

On macOS, you will need unixODBC as your ODBC driver manager. Many macOS ODBC programs use another driver manager called **iodbc**, but *the IBM i ODBC driver will not work with iodbc*. unixODBC is available on `homebrew`, and can be installed running the following command:

```
brew install unixodbc
```

### **Driver**

You will also have to install the macOS ODBC driver that allows unixODBC to talk to Db2 on i. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, scroll down and download the **ACS Mac App Pkg**. The package will include a standard macOS installer package, which can be installed by double clicking orby running the `pkgutil` command.

# **Using ODBC**

Now that you have the IBM i Access ODBC Driver installed on your system, you are ready to connect to Db2 on i.

## **Connection Strings**

ODBC uses a connection string with keywords to create a database connection. Keywords are case insensitive, and values passed are separated from the keyword by an equals sign ("`=`") and end with a semi-colon ("`;`"). As long as you are using an ODBC database connector, you should be able to pass an identical connection string in language or technology and be confident that it will correctly connect to Db2 on i. A common connection string may look something like:

```
DRIVER=IBM i Access ODBC Driver;SYSTEM=my.ibmi.system;UID=foo;PWD=bar;
```

In the above example, we define the following connection options:
* DRIVER: The ODBC driver for Db2 for i that we are using to connect to the database (and that we installed above)
* SYSTEM: The location of your IBM i system, which can be its network name, IP address, or similar
* UID: The User ID that you want to use on the IBM i system that you are connecting to
* PWD: The password of the User ID passed above.

These are only some of the over 70 connection options you can use when connecting to Db2 on i using the IBM i Access ODBC Driver. A complete list of IBM i Access ODBC Driver connection options can be found at the [IBM Knowledge Center: Connection string keywords webpage](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_74/rzaik/connectkeywords.htm). If passing connections options through the connection string, be sure to use the keyword labeled with **Connection String**. 

## **DSNs**

As you add more and more options to your connection string, your connection string can become quite cumbersome. Luckily, ODBC offers another way of defining connection options called a DSN (datasource name). Where you define your DSN will depend on whether you are using Windows ODBC driver manager or unixODBC on Linux or IBM i.

### **Configuration with UnixODBC (IBM i, Linux, macOS)**

IBM i, Linux distributions, and macOS use unixODBC and have nearly identical methods of setting up your drivers and your DSNs.

**`odbc.ini` and `.odbc.ini`**

When using unixODBC, DSNs are defined in `odbc.ini` and `.odbc.ini` (note the `.` preceding the latter). These two files have the same structure, but have one important difference: 

* `odbc.ini` defines DSNs that are available to **all users on the system**. If there are DSNs that should be available to everyone, they can be defined and shared here. Likely, this file is located in the default location, which depends on whether you are on IBM i or Linux:

* IBM i: `/QOpenSys/etc/odbc.ini`
* Linux: `/etc/unixODBC/odbc.ini`

If you want to make sure, the file can be found by running:

```
$ odbcinst -j
```

* `.odbc.ini` is found in your home directory (`~/`) and defines DSNs that are available **only to you**. If you are going to define DSNs with your personal username and password, this is the place to do it.

In both `odbc.ini` and `.odbc.ini`, you name your DSN with `[]` brackets, then specify keywords and values below it. An example of a DSN stored in `~/.odbc.ini` used to connect to an IBM i system with private credentials might look like:

```ini
[MYDSN]
Description            = My IBM i System
Driver                 = IBM i Access ODBC Driver
System                 = my.ibmi.system
UserID                 = foo
Password               = bar
Naming                 = 0
DefaultLibraries       = MYLIB
TrueAutoCommit         = 1
```

(**Note:** The name of the driver specified in the `Driver` keyword must match the name of a driver defined in `odbcinst.ini`. The location of this file can also be found by running `odbcinst -j` in PASE. When you install the IBM i Access ODBC Driver on your system, it automatically creates a driver entry of `IBM i Access ODBC Driver` in `odbcinst.ini`, which you should use for all IBM i connections).

When installing the IBM i Access ODBC Driver on IBM i, the driver will automatically create a DSN called `[*LOCAL]` in your `odbc.ini`:

```ini
### IBM provided DSN - do not remove this line ###
[*LOCAL]
Description = Default IBM i local database
Driver      = IBM i Access ODBC Driver
System      = localhost
UserID      = *CURRENT
### Start of DSN customization
### End of DSN customization
### IBM provided DSN - do not remove this line ###
```

When using this DSN, the user credentials used will be `*CURRENT`, which is the user who is running the process that is trying to connect to the ODBC driver. Use of this `*CURRENT` behavior is dependent on some server PTFs:

* 7.2: SI68113
* 7.3: SI69058
* 7.4: (none, comes with the operating system)

Like connection string keywords, DSN keywords can be found at the [IBM Knowledge Center: Connection string keywords webpage](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_74/rzaik/connectkeywords.htm). When passing connection options through a DSN, be sure to use the keyword labeled with **ODBC.INI**.

### **Configuration on Windows**

When you have the driver installed on your system, you can now configure your datasource names (DSNs) that allow you to wrap all of your connection settings in one place that can be used by any ODBC application.

In ODBC Data Source Administrator, you can define either User DSNs or System DSNs. A User DSN will be available only to your Windows user, while a System DSN will be available to everyone. Furthermore, System DSNs must be defined per-architecture, while User DSNs are architecture agnostic.

To create a DSN, select either User DSN or System DSN and then select `Add` on the right-hand menu. It will prompt you to select a driver, and you will select `IBM i Access ODBC Driver`. Use the GUI to add configuration options, such as your username and passwords, threading, default library, and so on.

### **Using Your DSN**

Once you have DSNs defined with the connection options you want, you can simply pass a connection string to your ODBC connections that references the DSN:

```
DSN=MYDSN
```

This will look through your DSNs for a match, and pull in all connection options defined therein. This helps keep your connection string much more manageable, and also keeps your connections string more secure since you don't have to explicitly pass your password in plain text.

Additional options can 

# **Node.js Example**

This quick example will demonstrate development on a non-IBM i machine against Db2 on i, and then how you would transfer that same code to run on IBM i when you are ready to run in production.

For this example, we will be using Node.js and the `odbc` package available on NPM. Node.js is simply used as an example technology, and this same thing could be done with PHP, Python, R, or any other package that has the ability to connect to the ODBC driver manager.

## **Setting Up Your Development Environment**

### **DSNs**

The following instructions assume you have set up your ODBC environment [as outlined in the sections above](#installation). On your development machine, define a private DSN similar to the following, adding in your system and user credentials:

```ini
[MYDSN]
Description            = The IBM i System
Driver                 = IBM i Access ODBC Driver
System                 = PUT.YOUR.SYSTEM.HERE
UserID                 = USERNAME
Password               = PASSWORD
```

### **Node.js**

To run through this example, you will need to have Node.js installed. You can find the downloads at the [official Node.js website](https://nodejs.org/en/download/) or through your system's package manager.

When you have Node.js installed, navigate to a new folder to contain your project and run:

```
npm init -y
```

This will create a file for you called `package.json`, which tracks software you download from npm (among other things).

Next, install the `odbc` package, which allows Node.js to talk to your driver manager.

```
npm install odbc
```

You now have everything you need to connect to Db2 for i from your development machine!

## **Development**

Using the `odbc` package, you can use a connection string that only references the DSN you defined above. Once you have the connection created, all of your queries will be run against the IBM i system defined in the DSN.

**`app.js`**
```javascript
const odbc = require('odbc');

odbc.connect('DSN=MYDSN', (error, connection) => {
  if (error) { throw error; }
  // now have an open connection to IBM i from any Linux or Windows machine
  connection.query('SELECT * FROM QIWS.QCUSTCDT', (error, result) => {
    if (error) { throw error; }
    console.log(result);
  })
});
```

## **Transfer to IBM i**

When you are ready to transfer your program to IBM i, you just need to make sure you have everything set up on that system.

### **DSNs**

Like on your development machine, you will have to install your driver manager and driver. Steps to do that can be found in [installation on IBM i](#installation-on-ibm-i) section. That section will also cover instructions for downloading the Db2 for i driver and how to configure your DSNs, though this example will use the default `*LOCAL` DSN.

### **Node.js**

Because we want to transfer our Node.js application to our IBM i system, we will have to have Node.js installed:

```bash
$ yum install nodejs10
```

You will then have Node.js v10 on your system. You simply need to move your code over to your IBM i system. Because we want to connect to the local database, we change our DSN to be `*LOCAL` instead of `MYDSN`:

**`app.js`**
```javascript
const odbc = require('odbc');

odbc.connect('DSN=*LOCAL', (error, connection) => {
  if (error) { throw error; }
  // now have an open connection to IBM i from any Linux or Windows machine
  connection.query('SELECT * FROM QIWS.QCUSTCDT', (error, result) => {
    if (error) { throw error; }
    console.log(result);
  })
});
```