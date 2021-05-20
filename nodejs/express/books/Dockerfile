FROM registry.access.redhat.com/ubi8/nodejs-14
WORKDIR /app
COPY . .
USER 0
# Install EPEL https://fedoraproject.org/wiki/EPEL for autossh
RUN yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
RUN yum -y install unixODBC-devel gcc autossh
# odbc driver
RUN unzip -j IBMiAccess\*.zip \*x86_64.rpm
RUN rm -f ibm-iaccess-32bit*.rpm
RUN yum -y  install  ./ibm-iaccess-*.rpm
# install deps
RUN npm install
# start app
CMD ["/bin/bash", "-c", "./tunnel.sh $USER_AT_HOST node server.js"]
