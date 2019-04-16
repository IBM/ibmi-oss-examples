# Restoring the Library

This repo includes save files `flght400.savf` and `flight400m.savf` extracted from [flght400.zip](ftp://www.redbooks.ibm.com/redbooks/SG247284/)

You can run `setup.sh` from a ssh session to restore the libraries from the save file.

First make sure the script is executable

`chmod +x setup.sh`

Now run the script

`./setup.sh`

Or you can manually restore the libraries:

First use gzip to extract the save files

```bash
gzip -d /path/to/flght400.savf
gzip -d /path/to/flght400m.savf
```

5250 session:

```
CPYFRMSTMF FROMSTMF('/path/to/flght400.savf') TOMBR('/QSYS.LIB/QGPL.LIB/FLGHT400.FILE')
CPYFRMSTMF FROMSTMF('/path/to/flght400m.savf') TOMBR('/QSYS.LIB/QGPL.LIB/FLGHT400.FILE')

RSTLIB SAVLIB(FLGHT400) DEV(*SAVF) SAVF(QGPL/FLGHT400)
RSTLIB SAVLIB(FLGHT400M) DEV(*SAVF) SAVF(QGPL/FLGHT400M)
```

## flight 400 RPG service program ERROR (IBM error)

An error flght400m service program (IBM error). Please fix for correct operation.
(Note: Fixed on yips.idevcloud.com).
```
fix source, then compile:
> addlibe flght400
> addlibe flght400m
> CALL PGM(BLDNFS001) PARM(FLGHT400M FLGHT400M)
> CALL PGM(BLDNFS400) PARM(FLGHT400M FLGHT400M)

fix source:
/QSYS.LIB/FLGHT400M.LIB/QRPGLESRC.FILE/QRPGLESRC.NFS001
      *------------------------------------------
     p ConvertRecord   b
      *------------------------------------------
     d ConvertRecord   pi                  likeds(ReserveInfo)
     d*
     d OrderInfo       ds                  likeds(ReserveInfo)
       :
       OrderInfo.DepartDate = %char(%date(DEPART):*mdy);
       // OrderInfo.DepartTime = %char(%date(DEPART):*usa); @ADC original
       OrderInfo.DepartTime = %char(%time(DEPART):*usa); // @ADC correct
       :
     p ConvertRecord   e

```

## flight 400 web access to RPG programs and data
```
> CHGAUT OBJ('/qsys.lib/FLGHT400.lib') USER(QTMHHTTP) DTAAUT(*RWX) OBJAUT(*ALL) SUBTREE(*ALL)
> CHGAUT OBJ('/qsys.lib/FLGHT400.lib') USER(QTMHHTP1) DTAAUT(*RWX) OBJAUT(*ALL) SUBTREE(*ALL)
> CHGAUT OBJ('/qsys.lib/FLGHT400M.lib') USER(QTMHHTTP) DTAAUT(*RWX) OBJAUT(*ALL) SUBTREE(*ALL)
> CHGAUT OBJ('/qsys.lib/FLGHT400M.lib') USER(QTMHHTP1) DTAAUT(*RWX) OBJAUT(*ALL) SUBTREE(*ALL)
```


## flight 400 RPG service program APIs
```
qsh
 > cd /Qsys.lib/FLGHT400M.lib/QSRVSRC.FILE
 > ls
   NFS001.MBR      NFS400.MBR      NFSUTIL.MBR
 > grep -i export NFSUTIL.MBR
               EXPORT     SYMBOL(DAYOFWEEK)
 > grep -i export NFS400.MBR
               EXPORT     SYMBOL(FINDFLIGHTS)
               EXPORT     SYMBOL(FINDFLIGHTSDOW)
               EXPORT     SYMBOL(GETFLIGHTINFO)
               EXPORT     SYMBOL(FINDFROMCITIES)
               EXPORT     SYMBOL(FINDTOCITIES)
               EXPORT     SYMBOL(GETCITYNAME)
               EXPORT     SYMBOL(FINDCUSTOMERS)
               EXPORT     SYMBOL(GETCUSTNUMBER)
               EXPORT     SYMBOL(GETCUSTNAME)
 > grep -i export NFS001.MBR
               EXPORT     SYMBOL(COMPUTEPRICE)
               EXPORT     SYMBOL(RESERVEFLIGHT)
               EXPORT     SYMBOL(FINDORDERCUST)
               EXPORT     SYMBOL(FINDORDERDATE)
               EXPORT     SYMBOL(GETORDERINFO)
               EXPORT     SYMBOL(UPDATEORDER)
```

```
qsh
 > cd /Qsys.lib/FLGHT400M.lib/QRPGLESRC.FILE
 > ls
   FRS001.MBR      FRS404.MBR      NFS400PR.MBR    NFS405PR.MBR
   FRS002.MBR      FRS405.MBR      NFS402.MBR      NFSUTIL.MBR
   FRS003.MBR      FRS407.MBR      NFS402PR.MBR    NFSUTILPR.MBR
   FRS009.MBR      FRS408.MBR      NFS404.MBR      RTDOFW.MBR
   FRS402.MBR      NFS001.MBR      NFS404PR.MBR
   FRS403.MBR      NFS001PR.MBR    NFS405.MBR

 > grep d NFS001PR.MBR
       	d ComputePrice    pr
        d   BasePrice                    3    const
       	d   ServiceClass                 1    const
       	d   Tickets                      3  0 const
        d   Price            	         7  2
        d   Tax                          5  2
        d   TotalDue                     7  2

        d OrderSummary    ds                  qualified
        d  OrderNumber                   9B 0
        d  CustName                     64
       	d  DepartDate                    8

        d ReserveInfo     ds                  qualified
       	d  AgentNumber                   9B 0
        d  CustNumber                    9B 0
       	d  FlightNumber                  7
        d  DepartDate                    8
       	d  DepartTime                    8
       	d  Tickets                       3  0
        d  ServiceClass      	         1

        d ReserveFlight   pr
        d  OrderInfo                          likeds(ReserveInfo) const
        d  OrderNumber                   9B 0

        d FindOrderCust   pr
        d  Position                     64    const
       	d  ListType                      1    const
        d  CountReq                     10i 0 const
       	d  CountRet                     10i 0
        d  OrderList                          likeds(OrderSummary) dim(100)

       	d FindOrderDate   pr
        d  Position                      8    const
       	d  ListType                      1    const
       	d  CountReq                     10i 0 const
        d  CountRet          	        10i 0
        d  OrderList                          likeds(OrderSummary) dim(100)

        d GetOrderInfo    pr
        d  OrderNumber                   9B 0 const
        d  OrderInfo                          likeds(ReserveInfo)

        d UpdateOrder     pr
       	d  OrderNumber                   9B 0 const
        d  OldOrder                           likeds(ReserveInfo) const
       	d  NewOrder                           likeds(ReserveInfo) const
        d  ReturnCode                   10i 0

 > grep d NFS402PR.MBR
        d CityInfo        ds                  qualified
       	d  Name                         16
       	d  Initials                      3
       	d  Airline                       3

       	d FindFromCities  pr
       	d  Position                     16    const
       	d  ListType                      1    const
       	d  CountReq                     10i 0 const
       	d  CountRet                     10i 0
        d  CityList                           likeds(CityInfo) dim(100)
        d                                     options(*varsize)

        d FindToCities    pr
       	d  Position                     16    const
        d  ListType                      1    const
        d  CountReq                     10i 0 const
       	d  CountRet                     10i 0
       	d  CityList                           likeds(CityInfo) dim(100)
       	d                                     options(*varsize)

       	d GetCityName     pr
       	d  Initials                      3    const
       	d  FromTo                        1    const
       	d  Name                         16

 > grep d NFS404PR.MBR
        d FlightInfo      ds                  qualified
        d  Airline                       3
       	d  Flight                        7
        d  DoW                           2
       	d  DepartCity                    3
       	d  ArriveCity                    3
       	d  DepartTime                    8
       	d  ArriveTime                    8
       	d  Price                         3

       	d FindFlightsDoW  pr
       	d   FromCity                    16    const
        d   ToCity                      16    const
       	d   FlightDoW                   16    const
        d   FlightCount                 10i 0
        d   Flights                           likeds(FlightInfo) dim(50)

        d FindFlights     pr
       	d   FromCity                    16    const
        d   ToCity                      16    const
       	d   FlightDate                   8    const
       	d   FlightCount                 10i 0
       	d   Flights                           likeds(FlightInfo) dim(50)

       	d GetFlightInfo   pr
       	d  FlightNumber                  7    const
       	d  FlightInfo                         likeds(FlightInfo)

 > grep d NFS405PR.MBR
       	d CustInfo        ds                  qualified
       	d  Name                         64
       	d  Number                        9B 0

       	d FindCustomers   pr
       	d  Position                     64    const
       	d  ListType                      1    const
        d  CountReq                     10i 0 const
        d  CountRet                     10i 0
        d  CustList                           likeds(CustInfo) dim(100)
        d                                     options(*varsize)

        d GetCustNumber   pr
        d   Name                        64    const
       	d   Number                       9B 0
       	d   Generate                     1    const options(*nopass)

        d GetCustName     pr
       	d  Number                        9B 0 const
       	d  Name                         64

 > grep d NFSUTILPR.MBR
       	d DayOfWeek       pr            16    varying
       	d   Month                        2  0 value
       	d   Day                          2  0 value
       	d   Year                         4  0 value
```


# flight400 green screen
```
ADDLIBLE FLGHT400
GO FLGHT400/FRSMAIN
```

## Menu
```
FRSMAIN     10:13:39      Flight Reservation System       7/12/17     UT28P63

 Select one of the following:

      1. Create a New Reservation
      2. Update an existing Reservation
      3. Inquire on an existing Reservation
      4. Delete an existing Reservation
      5. Fax Reservation Information


     10. Flight Reservation System Maintenance


     20. Reservation System Reports



     90. Signoff
 Selection or command
 ===> 3                 
 F3=Exit   F4=Prompt   F9=Retrieve   F12=Cancel
 F13=Information Assistant  F16=System main menu
```

## Agent

F4 agent list. F10 to login (not enter). Agent password 'mercury' for all.
```
 Flights LOGON display                                         System: UT28P63

 Type choices, press F10 to continue


 Agent Name  . . . . . . . . . .       Joy           Name

 Password  . . . . . . . . . . .       mercury       Name














 F2=Refresh  F3=Exit  F4=Agent Prompt  F10=LOGON
```

## Display Order

F4 will provide list for Name.
```
 Flight Reservation System - Order Selection Panel             System: UT28P63

 Type choices, press F10 to continue


 Customer Name . . . .                             Name    ( F4 to Select )

 Date of Departure . . . . . . . . .  0000 00 00   Date    ( F5 to Select )

 Order Number  . . . . . . . . . . .   004971094   Order Number












 F2=Refresh  F3=Exit  F10=Work with Selection
```

## Display Order Information
```
 Flights Reservation System - Display Order     10:17:11  7/12/17      UT28P63

       FLIGHT INFORMATION                   TICKET ORDER INFORMATION           
                                                                               
                                                                               
    Airline: CON Flight: 5181055     Order Number...............:  004971094   
                                                                               
    Date of Flight..: 11 12 2004     Customer....: Aaronson, Linda             
                                                                               
                                     Class of Service - First...........:      
    From City:  Burlington                              Business........:      
                                                        Economy.........:  X   
    Depart Time.......: 07:19 AM                                               
                                     Number of Tickets..................: 01   
                                                                               
    To City...: San Diego            Price $.....................:    169.00   
                                     Tax $.......................:	6.76   
    Arrival Time......: 09:19 AM     Total Due w/ Tax $..........:    175.76   
                                                                               
                                                                               
                                                                               

 F3/F12=Exit
```
