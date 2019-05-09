## What is Node-RED
Flow-based programming for the Internet of Things (https://nodered.org/)

## Install Node-RED on IBM i
You need:
- 5770SS1, option 33 –Portable App Solutions Environment
- 5733SC1, option 1 –OpenSSH, OpenSSL, zlib3
- The YUM environment ( http://ibm.biz/ibmi-rpms)
- Node.js 8 or 10
- GCC (optional)

Then call:
```
npm -g i node-red
```

## Launch Node-RED
```
/QOpenSys/pkgs/lib/nodejs10/bin/node-red
```

## Install the Db2 for i addon
- Lanuch your browser and visit http://yourip:1880
- Click the button at the upper-right corner and click Manage palette.
- On the Install tab, search for db2, and then search for node-red-contrib-db2-for-i, and click Install. 

## Run the example
- Click the menu at the upper-right corner and click Import->Clipboard.
- Select the flow.json file to import to current flow.
- Click the depoly button at the upper-right corner
- Visit http://yourip:1880/query?sql=SELECT... to run your qurey

![screen shot](./screenshot.png?raw=true)