#!/QOpenSys/usr/bin/sh

SAVE_FILE="$(pwd)/hats.savf"

echo "$SAVE_FILE"

if [ ! -f $SAVE_FILE ]; then

    echo "unable to locate save file"
    exit 1
fi

system "CPYFRMSTMF FROMSTMF('$SAVE_FILE') TOMBR('/QSYS.LIB/QGPL.LIB/HATS.FILE')"

system "RSTLIB SAVLIB(HATS) DEV(*SAVF) SAVF(QGPL/HATS)"