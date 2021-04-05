#!/usr/bin/env bash
set -e

USAGE="usage: $0 user@host [command to exec]"
USER_HOST_PAIR=$1

function main {
    # https://www.ibm.com/support/knowledgecenter/en/ssw_ibm_i_71/rzaii/rzaiiservicesandports.htm
    I_SVR_PORTS="8470 8471 8472 8473 8474 8475 8476 449 446 9470 9471 9472 9473 9474 9475 9476"
    PORT_FWD_SSH_OPT=""
    for port in $I_SVR_PORTS
    do
        # ssh -L [LOCAL_IP:]LOCAL_PORT:DESTINATION:DESTINATION_PORT
        PORT_FWD_SSH_OPT="$PORT_FWD_SSH_OPT -L 0.0.0.0:$port:127.0.0.1:$port "
    done
    autossh -M 9000 -4 -i ./id_rsa -o StrictHostKeyChecking=no $PORT_FWD_SSH_OPT -N $USER_HOST_PAIR &
    $*
}

case "$USER_HOST_PAIR" in
    *'@'*) # ensure USER_HOST_PAIR contains @
        shift
        echo "Using host pair: $USER_HOST_PAIR"
        main $@
    ;;
    *)
        echo "USER_AT_HOST env variable not set! Tunneling will not be started"
        $*
    ;;
esac
