#!/QOpenSys/pkgs/bin/bash
set +x
[ -e /qsys.lib/COOLSTUFF.LIB ] || system -i "RUNSQL SQL('create schema coolstuff')"
[ -e /qsys.lib/COOLSTUFF.LIB/BASHQ2.DTAQ ] || system -i "CRTDTAQ DTAQ(COOLSTUFF/BASHQ2) MAXLEN(64512) SEQ(*KEYED) KEYLEN(100) SENDERID(*YES) SIZE(*MAX2GB)"
[ -e /qsys.lib/COOLSTUFF.LIB/BASHQ.DTAQ ] || system -i "CRTDTAQ DTAQ(COOLSTUFF/BASHQ) MAXLEN(64512) SEQ(*KEYED) KEYLEN(100) SENDERID(*YES) SIZE(*MAX2GB)"

system -i "RUNSQLSTM SRCSTMF('$PWD/setup.sql')" | grep -E '^MSG|^SQL'