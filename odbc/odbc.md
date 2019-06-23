# **ODBC**

Open Database Connectivity (ODBC) is a standardized API for connecting to databases that is cross-platform and cross-DBMS. By installing an general ODBC driver manager and a driver for your specific DBMS, the code that interacts with the ODBC API can be generalized. This makes ODBC a very powerful tool for both development and for production, as the application can be deployed on any system and talk to any DBMS as long as it has the correct drivers installed.

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
      * [Installation on Linux with RPMs](#installation-on-linux-with-rpms)
      * [Installation on Linux with debs](#installation-on-linxu-with-debs)
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

For the open-source software team, ODBC is the preferred method of connecting to Db2 on IBM i.

* Because ODBC is cross-platform, it allows you to develop your applications directly on your development machine, whether it's a Linux, Windows, or directly on on IBM i. Database connectors built specifically for IBM i often cannot be built or run on a non-IBM i system.

* When it is time to deploy your application to IBM i, you can simply move your code from your development machine to your IBM i system. Your database commands will remain unchanged, and as long as you have also set up ODBC on the IBM i system, everything will _just work_.

* ODBC offers a higher level of connection configuration than is available with CLI-based connectors. This makes it easy for you to change the behavior of Db2 either from on or off system to fit your application's needs.

* By moving to ODBC as opposed to an IBM i-only solution, the open-source team can contribute alongside developers working on other systems, making the open-source software available to IBM i users much more robust.

# **Installation**

The instructions for installing and ODBC driver and manager and the IBM i ODBC driver for Db2 on IBM i will depend on what operating system you are running. Select your operating system below to see setup instructions for getting ODBC on your system and connected to your IBM i.

* [Installation on IBM i](#installation-on-ibm-i)
* [Installation on Linux](#installation-on-linux)
* [Installation on Windows](#installation-on-windows)

## **Installation on IBM i**

### **Driver Manager**

On IBM i, we will be using unixODBC as our driver manager. Like all open-source software, you need to use yum to install these packages, which will require you to be using IBM 7.2 or greater. If you do not yet have yum installed on your system, [please consult the installation guide here.](https://ibm.biz/ibmi-rpms)

To make sure that unixODBC is available (it should be, if you have yum installed), run `yum list available unixODBC*` to get a print out of all packages matching that name:

```bash
$ yum list available unixODBC*
Available Packages
unixODBC.ppc64                          2.3.4-2                     Artifactory 
unixODBC-devel.ppc64                    2.3.4-2                     Artifactory 
```

You should see both `unixODBC` and `unixODBC-devel` packages displayed. To develop your applications using ODBC, you will need to download both both of these packages.

```bash
$ yum install unixODBC unixODBC-devel
```

You now have unixODBC installed on your system. This serves as your driver manager, allowing the ODBC applications you write to communicate with your drivers and from there Db2. 

### **Driver**

Now that you have the driver manager installed, you will have to install the ODBC driver that allows your IBM i machine to use unixODBC to talk to Db2. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, scroll down and download the **ODBC driver for IBM i 7.2 or later**.  More complete instructions on how to download this driver can be found at [this TechNote on the ODBC Driver for the IBM i PASE environment](https://www-01.ibm.com/support/docview.wss?uid=ibm10885929).

When the driver has been downloaded and unzipped, you can run the rpm with yum the same way you would otherwise, but giving it the location of the file instead of the name of the package:

```bash
$ yum install <package-location>/ibm-iaccess-<version>.rpm
```

This will install the Db2 ODBC driver onto your IBM i system. It will also create a DSN for your local system called `*LOCAL`. This is discussed below.

## **Installation on Linux**

### **Driver Manager**

On Linux, we will be using unixODBC as our driver manager. To install, use the package manager that comes with your system and search for `unixODBC*`, which should return all packages available to you that begin with "unixODBC". You will have to download `unixODBC` and `unixODBC-devel` or similar (may be named different things on different Linux distributions).

#### **Installation on Linux with RPMs**

For Linux distributions that use `yum` as their package manager (much like IBM i), the following command and output shows how to check for the correct packages to download:

**yum example**
```bash
$ yum list available unixODBC*
Available Packages
unixODBC.i686                                2.3.1-11.el7                             RHEL-76-x86_64
unixODBC-devel.i686                          2.3.1-11.el7                             RHEL-76-x86_64
```

Once you know what packages are needed, they can be downloaded also through your package manager:

**yum example**
```bash
$ yum install unixODBC unixODBC-devel
```

You now have unixODBC installed on your system

#### **Installation on Linux with debs**

// TODO:

### **Driver**

Now that you have the driver manager installed, you will have to install the ODBC driver that allows your IBM i machine to use unixODBC to talk to Db2. To get the driver, visit [the IBM i Access - Client Solutions page](https://www-01.ibm.com/support/docview.wss?uid=isg3T1026805) and select **Downloads for IBM i Access Client Solutions**. After logging in and redirected to the IBM I Access Client Solutions download page, scroll down and download the **ACS Linux App Pkg**.

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

With your DSNs now set up, you can use them when connecting to Db2. Many open-source projects have ODBC connectors that allow you to use your DSN to connect to Db2 on IBM i. For example, Node.js has the `odbc` package, Python has `pyodbc`, etc.

To use your DSN, simply pass a connection string like so to the connection API for the open-source technology and package of your choice:

```
"DSN=MYDSN"
```
When you pass the connection string above, the odbc driver manager will look at your DSNs (both from the global `odbc.ini` and your personal `.odbc.ini`) and add all of the additional settings defined therein. In this way, you don't need to specify things like your username and password in your application, and can instead rely on your configuration files!

If you would like to configuration options that extend those listed in your DSN, consult the [IBM Knowledge Center: Connection string keywords webpage](https://www.ibm.com/support/knowledgecenter/ssw_ibm_i_73/rzaik/connectkeywords.htm). Make sure you are using the option keys listed with **Connection String**.

## **Node.js Example**

This quick example will show how your configuration files might look on a non-IBM i machine as your are actively developing against Db2 on IBM i, and then how you would go about transferring that same code to run on your IBM i when you are ready to run in production.

For this example, we will be using Node.js and the `odbc` package available on NPM. Node.js is simply used as an example technology, and this same thing could be done with PHP, Python, R, or any other package that has the ability to connect to the ODBC driver manager.

## **Setting up your Development Environment**

### **Driver Manager, Driver, and DSNs**

First, you will have to install your driver manager and driver. Steps to do that can be found in the [Windows](#windows.md) or [Linux](./2.linux.md) pages of this tutorial. These pages will also tell you how to set up your Drivers and DSNs, which is a different process depending on if you are on Windows or Linux.

A dummy DSN for connecting to your IBM i might look like:
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

You now have everything you need to connect to your IBM i Db2 database from your development machine!

## **Development**

Using the `odbc` package, and passing the name of your DSN as your connection string, all of your queries will be run against the IBM i system listed in the DSN.

**`app.js`**
```javascript
const odbc = require('odbc');

odbc.connect('DSN=MYDSN', (error, connection) => {
  if (error) { throw error; }
  // now have an open connection to your IBM i from any Linux or Windows machine
  connection.query('SELECT * FROM QIWS.QCUSTCDT', (error, result) => {
    if (error) { throw error; }
    console.log(result);
  })
});
```
In this way you can develop remotely instead of directly on your IBM i, while still accessing Db2 on your IBM i.

## **Transfer to your IBM i**

When you are ready to transfer your program to your IBM i, you just need to make sure you have everything set up on that system.

### **Driver Manager, Driver, and DSNs**

Like on your development machine, you will have to install your driver manager and driver. Steps to do that can be found in the [IBM i Setup](./2.ibmi.md) page of this tutorial. This page will also tell you where to download the correct Db2 driver and how Drivers and DSNs.

When working directly on your IBM i system and wanting to connect locally, your DSN in `~/.odbc.ini` may look like:

```ini
[MYDSN]
Description            = This local system
Driver                 = IBM i Access ODBC Driver
System                 = localhost
UserID                 = MYIBMIUSER
Password               = password1234
```

Note that your Driver name will have to match the name of in your driver list (which is in `/QOpenSys/etc/odbcinst.ini`).

### Node.js

On IBM i, if you have the open-source environment installed, simply run:

```bash
$ yum install nodejs10
```

You will then have Node.js on your system. You simply need to move your code over to your new system, and because we have the same DSN name as we did on our remote development machine, everything will connect the same as it did when you were developing on a different machine!

If you were to give your local machine a different DSN name (something like `[LOCAL]`), you would simply need to change your connection string in your Node.js application:

**`app.js`**
```javascript
const odbc = require('odbc');

odbc.connect('DSN=LOCAL', (error, connection) => {
  if (error) { throw error; }
  // now have an open connection to your IBM i from any Linux or Windows machine
  connection.query('SELECT * FROM QIWS.QCUSTCDT', (error, result) => {
    if (error) { throw error; }
    console.log(result);
  })
});
```