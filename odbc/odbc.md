# **ODBC**

Open Database Connectivity (ODBC) is a standardized API for connecting to databases that is cross-platform and cross-DBMS (Database Management System). By installing an general ODBC driver manager and a driver for your specific DBMS, the code that interacts with the ODBC API can be generalized. This makes ODBC a very powerful tool for both development and for production, as the application can be deployed on any system and talk to any DBMS as long as it has the correct drivers installed.

## **Table of Contents**

* [ODBC](#odbc)
  * [Table of Contents](#table-of-contents)
  * [Why ODBC?](#why-odbc)
* [Installation](#installation)
  * [Installation on IBM i](#installation-on-ibm-i)
    * [Driver Manager](#driver-manager-0)
    * [Driver](#driver-0)
  * [Installation on Linux](#installation-on-linux)
    * [Driver Manager](#driver-manager-1)
    * [Driver](#driver-1)
  * [Installation on Windows](#installation-on-windows)
    * [Driver Manager](#driver-manager-2)
    * [Driver](#driver-2)
* [Configuration](#configuration)
  * [Configuration with UnixODBC (IBM i, Linux)](#configuration-with-unixodbc-ibm-i-linux)
  * [Configuration on Windows](configuration-on-windows)
* [Usage](#usage)
  * [DSN in Connection Strings](#dsn-in-connection-strings)
  * [Node.js Example](#nodejs-example)

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

## **Installation on IBM i**

### **Driver Manager**

On IBM i, we will be using unixODBC as our driver manager. Like all open-source software, you need to use yum to install these packages, which will require you to be using IBM 7.2 or greater. If you do not yet have yum installed on your system, [please consult the installation guide here.](https://ibm.biz/ibmi-rpms)

To use an ODBC connection on your IBM i system, you will need to install the `unixODBC` package. Additionally, if you want to develop your applications using ODBC connections with connectors like pyODBC for Python or odbc for Node.js. you will have to install `unixODBC-devel` as well.

```bash
$ yum install unixODBC unixODBC-devel
```

You now have unixODBC installed on your system. This serves as your driver manager, allowing the ODBC applications you write to communicate with your drivers and from there Db2. 

### **Driver**

Now that you have the driver manager installed, you will have to install the ODBC driver that allows your IBM i machine to use unixODBC to talk to Db2. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, select the `Download using http` tab then scroll down and download the **ODBC driver for IBM i 7.2 or later**.  More complete instructions on how to download this driver can be found at [this TechNote on the ODBC Driver for the IBM i PASE environment](https://www-01.ibm.com/support/docview.wss?uid=ibm10885929).

When the driver has been downloaded and unzipped and transferred to your IBM i system, you can run the rpm with yum the same way you would otherwise, but giving it the location of the file instead of the name of the package:

```bash
$ yum install <package-location>/ibm-iaccess-<version>.rpm
```

This will install the Db2 ODBC driver onto your IBM i system. It will also create a driver entry in your `odbcinst.ini` and a DSN in `odbc.ini` for your local system called `*LOCAL`. This is discussed below.

## **Installation on Linux**

### **Driver Manager**

On Linux, we will be using unixODBC as our driver manager. Fortunately, unixODBC is automatically pulled in when you install the IBM i Access ODBC Driver for Linux, so there isn't any set up that you have to do for this stage.

### **Driver**

To get both the driver manager and the driver that allows ODBC to talk to Db2 for i, you will have to install the IBM i Access ODBC Driver for Linux. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions Download page, select the `Download using http` tab then scroll down and download the **ACS Linux App Pkg**.

In this package, there is a README that will help explain how to install the driver with either with RPMs or DEBs, depending on your Linux distribution. Just know that when you install the driver, it should pull in all of the packages you need to create an ODBC connection to Db2 for i from your Linux system.

## **Installation on Windows**

### **Driver Manager**

Windows comes preinstalled with an ODBC driver manager. To access it, search for `Administrative Tools` on your system (either through the search bar, or `Control Panel > System and Security > AdministrativeTools`), and then from there select ODBC Data Sources (either 32-bit or 64-bit).

From this application, you can set up your drivers.

### **Driver**

Now that you have the driver manager installed, you will have to install the ODBC driver that allows your IBM i machine to use unixODBC to talk to Db2. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, scroll down and download the **ACS Windows App Pkg English (64bit)**.

When the package has been downloaded and has been installed on your system, it should be available to see on your ODBC Data Source Administrator application.

# **Configuration**

With both the driver manager and driver installed on your system, you will still need to configure your drivers and DSNs (datasource names) to be able to use ODBC in your applications.

* [Configuration with UnixODBC (IBM i, Linux)](#configuration-with-unixodbc-ibm-i-linux)
* [Configuration on Windows](#configuration-on-windows)

## **Configuration with UnixODBC (IBM i, Linux)**

Both IBM i and Linux distributions use unixODBC and have nearly identical methods of setting up your drivers and your DSNs.

### **`odbcinst.ini`**

To declare a driver so that it can be referenced in your datasources, you will have to define your driver in a file called `odbcinst.ini`. This file can be found by entering the command 

```
$ odbcinst -j
```

Likely, this file is located in the default location, depending on whether you are on IBM i or Linux:

* IBM i: `/QOpenSys/etc/odbcinst.ini`
* Linux: `/etc/unixODBC/odbcinst.ini`

In this file, you define a name for each of your drivers, and tell unixODBC where it can find driver referenced in your datasources. An example `odbcinst.ini` might look like:

**`odbcinst.ini`**
```ini
[IBM i Access ODBC Driver]
Description = IBM i Access ODBC Driver
Driver      = /QOpenSys/pkgs/lib/libcwbodbc.so
```
(Note: You don't have to align the `=` signs, it just looks cleaner.)

Luckily, the IBM i Access ODBC Driver will automatically create driver entries in your `odbcinst.ini` when you install the driver. When you define datasources in `odbc.ini` and `.odbc.ini` (covered below), you will use the name in the `[]` brackets as the name of the driver to use.

If you have multiple drivers to define, you can simply create mutiple entries in the same file, as long as each driver is headed with a driver name in brackets, and no two drivers have the same name.

**`odbc.ini` and `.odbc.ini`**

When you have a driver defined, you will want to also define a datasource name, or DSN. A DSN allows you to define a connection and all of your connection options in one place. When you pass a connection string to an ODBC connection, you simply need to pass the name of the DSN and all of the connection options defined with the DSN will also be included.

DSNs are defined in `odbc.ini` and `.odbc.ini` (note the `.` preceding the latter). These two files have the same structure, but have one important difference: 

* `odbc.ini` can be found the same way we found the location of `odbcinst.ini`, by using

```
$ odbcinst -j
```

Likely, this file is located in the default location, depending on whether you are on IBM i or Linux:

* IBM i: `/QOpenSys/etc/odbc.ini`
* Linux: `/etc/unixODBC/odbc.ini`

This files defines DSNs that are available to **all users on the system**. If there are DSNs that should be available to everyone, they can be defined and shared here.

* `.odbc.ini` is found in your home directory (`~/`) and defines DSNs that are available **only to you**. If you are going to define DSNs with your personal username and password, this is the place to do it.

The files define DSNs similar to how `odbcinst.ini` defines drivers: You name your DSN with `[]` brackets, then specify keywords and values below them. This is an example of a  stored in `~/.odbc.ini` used to connect to an IBM i with private credentials:

```ini
[MYDSN]
Description            = oss73dev IBM i system
Driver                 = IBM i Access ODBC Driver
System                 = OSS73DEV.RCH.STGLABS.IBM.COM 
UserID                 = MYNAME
Password               = password123
Naming                 = 0
DefaultLibraries       = MYLIB
TrueAutoCommit         = 1
```
(**Note: The name of the driver specified in the `Driver` keyword must match the name of a driver defined in `odbcinst.ini`).

Additionally, when installing on IBM i, the driver will automatically create a DSN called `[*LOCAL]` in your `odbc.ini`. When using this DSN, the user credentials used will be `*CURRENT`, which is the user who is running the process that is trying to connect to the ODBC driver. Use of this `*CURRENT` behavior is dependent on some server PTFS:

* 7.2: SI68113
* 7.3: SI69058

A complete list of IBM i Access ODBC Driver connection options for both DSN definitions and connection strings can be found at the [IBM Knowledge Center: Connection string keywords webpage](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_74/rzaik/connectkeywords.htm).

## Configuration on Windows

When you have the driver installed on your system, you can now configure your datasource names (DSNs) that allow you to wrap all of your connection settings in one place that can be used by any ODBC application.

In ODBC Data Source Administrator, you can define either User DSNs or System DSNs. A User DSN will be available only to your Windows user, while a System DSN will be available to everyone. Furthermore, System DSNs must be defined per-architecture, while User DSNs are engine agnostic.

To create a DSN, select either User DSN or System DSN and then select `Add` on the right-hand menu. It will prompt you to select a driver, and you will select `IBM i Access ODBC Driver`. Use the GUI to add configuration options, such as your username and passwords, threading, default library, and so on.

# **Usage**

## **DSN in Connection Strings**

With your DSNs now set up, you can use them when connecting to Db2. Many open-source projects have ODBC connectors that allow you to use your DSN to connect to Db2 on i. For example, Node.js has the `odbc` package, Python has `pyodbc`, etc.

To use your DSN, simply pass a connection string like so to the connection API for the open-source technology and package of your choice:

```
"DSN=MYDSN"
```
When you pass the connection string above, the odbc driver manager will look at your DSNs (both from the global `odbc.ini` and your personal `.odbc.ini`) and add all of the additional settings defined therein. In this way, you don't need to specify things like your username and password in your application, and can instead rely on your configuration files!

If you would like to configuration options that extend those listed in your DSN, consult the [IBM Knowledge Center: Connection string keywords webpage](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_73/rzaik/connectkeywords.htm). Make sure you are using the option keys listed with **Connection String**.

## **Node.js Example**

This quick example will show how your configuration files might look on a non-IBM i machine as your are actively developing against Db2 on i, and then how you would go about transferring that same code to run on IBM i when you are ready to run in production.

For this example, we will be using Node.js and the `odbc` package available on NPM. Node.js is simply used as an example technology, and this same thing could be done with PHP, Python, R, or any other package that has the ability to connect to the ODBC driver manager.

## **Setting up your Development Environment**

### **Driver Manager, Driver, and DSNs**

First, you will have to install your driver manager and driver. Steps to do that can be found in the [Windows](#windows.md) or [Linux](./2.linux.md) pages of this tutorial. These pages will also tell you how to set up your Drivers and DSNs, which is a different process depending on if you are on Windows or Linux.

A dummy DSN for connecting to IBM i might look like:

```ini
[MYDSN]
Description            = My dummy IBM i system for this example
Driver                 = IBM i Access ODBC Driver
System                 = MY.IBMI.SYSTEM.COM
UserID                 = MYIBMIUSER
Password               = password1234
```

Note that your Driver name will have to match the name of a driver from your driver list (either in `odbcinst.ini` or in the Windows ODBC GUI).

### **Node.js**

Next, you will need to have Node.js installed. You can find the downloads at the [official Node.js website](https://nodejs.org/en/download/) or through your system's package manager.

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

Using the `odbc` package, and passing the name of your DSN as your connection string, all of your queries will be run against the IBM i system listed in the DSN.

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
In this way you can develop remotely instead of directly on IBM i, while still accessing Db2 for i.

## **Transfer to IBM i**

When you are ready to transfer your program to IBM i, you just need to make sure you have everything set up on that system.

### **Driver Manager, Driver, and DSNs**

Like on your development machine, you will have to install your driver manager and driver. Steps to do that can be found in [installation on IBM i](#installation-on-ibm-i) section. This section will also cover instructions for downloading the Db2 for i driver and how to configure your drivers and DSNs.

When you install the driver on IBM i, you automatically get a DSN labaled `*LOCAL` that is used to connect to the local Db2 on i database using the credentials of the user running the job that the connection is made from. On 7.2 and 7.3, this requires additional PTFs that are outlined in the [installation on IBM i](#installation-on-ibm-i) section. The `*LOCAL` DSN definition looks like:

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

### Node.js

Below is a simple example of using ODBC with Node.js. On IBM i, if you have the open-source environment installed, simply run:

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