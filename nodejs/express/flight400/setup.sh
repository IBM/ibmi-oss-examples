#!/QOpenSys/usr/bin/sh

FLIGHT_400="$(pwd)/flght400.savf"
FLIGHT_400M="$(pwd)/flght400m.savf"
echo "$FLIGHT_400"
echo "$FLIGHT_400M"

if [ ! -f "$FLIGHT_400.gz" ]; then

    echo "unable to locate flght400 save file"
    exit 1
fi

if [ ! -f "$FLIGHT_400M.gz" ]; then

    echo "unable to locate flght400m save file"
    exit 1
fi

gzip -dv "$FLIGHT_400.gz"
echo "copying from $FLIGHT_400 stream file"
system "CPYFRMSTMF FROMSTMF('$FLIGHT_400') TOMBR('/QSYS.LIB/QGPL.LIB/FLGHT400.FILE')"
echo "restoring FLGHT400 lib"
system "RSTLIB SAVLIB(FLGHT400) DEV(*SAVF) SAVF(QGPL/FLGHT400)"

gzip -dv "$FLIGHT_400M.gz"
echo "copying $FLIGHT_400M from stream file"
system "CPYFRMSTMF FROMSTMF('$FLIGHT_400M') TOMBR('/QSYS.LIB/QGPL.LIB/FLGHT400M.FILE')"
echo "restoring FLGHT400M lib"
system "RSTLIB SAVLIB(FLGHT400M) DEV(*SAVF) SAVF(QGPL/FLGHT400M)"
