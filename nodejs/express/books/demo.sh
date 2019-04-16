#! /usr/bin/bash

# demo.sh [url] [port]
set -e

if [ $# -eq 0 ]; then
    echo -e "\nSimulate requests to the express books application\n"
    echo -e "usage: demo.sh host [PORT=4000]\nexample: demo.sh http://hostname.com\n"
    exit 1
fi

URL=$1

PORT=$2

if [ -z $PORT ]; then
    echo -e "Port not specified using default 4000\n"
    PORT="4000"
fi

JSONROUTE="$URL:$PORT/getJSON"
PRIMESROUTE="$URL:$PORT/primes/calc"

echo -e "Get Request will be made to:\n1. $JSONROUTE \n2. $PRIMESROUTE\n"

while true;

do
    curl $JSONROUTE > /dev/null;
    sleep 1;
    curl $PRIMESROUTE > /dev/null;
    sleep 3;

done