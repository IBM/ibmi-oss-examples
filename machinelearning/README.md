# ML on i
## Intro
  This project is used to demonstrate the capacity of IBM i platform on ML/AI area. I encounge you to use, share or even add more sub-projects/notebook to this repo.  Any comments , suggestions or advisors are welcome. thanks.

## How to setup your environment of ML on i
+ Here's where we can  [setup RPM](http://ibm.biz/ibmi-rpms
) env on i. 
+ After setup the RPM env on i, we need to install following packages by yum.
---
Package|Description|Comments
--|:--|:--
tcl|TCL language support|
tk|TK package for GUI support of TCL|
python3|Python3 support|
python3-devel|python3 development package|
python3-ibm_db|DBAPI support package for IBM i|
python3-numpy|numpy package  |
python3-scipy|scipy package|
python3-scikit-learn|scikit-learn package|
python3-matplotlib|matplotlib package|*
libzmq|Zero-MQ library|*
python3-jupyter|Jupyter notebook support|*
*:may not available yet.

---
+ Start the jupyter server by command:

  `jupyterf notebook --ip=<your host name> --port=<port number>`

## Contents of this repo.
- **dbconn/loadcsv2db2.py**, this is a tool to import your data from csv to db2 on i. Or course, in most cases your data is already in db2.  NOTE, this script is using the non-journal database.
- **dbconn/runsql.py**, this is a tool of python, which let you run a sql command through command line.
- **homeCredit** , this is based on one kernel of a real data science competation on kaggle: [homeCredit]( https://www.kaggle.com/c/home-credit-default-risk). The kernel we used is : [start-here-a-gentle-introduction](https://www.kaggle.com/willkoehrsen/start-here-a-gentle-introduction). While the most difference from it is that we tried to use data in db2 as the source instead of csv stream file. This notebook would help you to understand how data be reterieved from db2 and used in a normal data science project. 
- **sklearndemos**, a folder to store some sklearn demos which running well on IBM i platform.

## Contacts
   GavinZhang @ IBM: zhanggan@cn.ibm.com
   
