FROM registry.access.redhat.com/ubi8/nodejs-10
WORKDIR /app
COPY . .

# install odbc driver
RUN id
USER 0
RUN yum repolist
RUN yum --assumeyes install unixODBC-devel gcc
RUN yum --assumeyes install python3 && ln -sf python3 /usr/bin/python
RUN curl -vvv -k 'https://w3.rchland.ibm.com/projects/CA400/Win32/process/express/drivers/pool/v7r2m0/v0001/IBMiAccess_v1r1_LinuxAP_u14.zip' -o ap.zip
RUN unzip -j ap.zip \*x86_64.rpm
RUN yum --assumeyes  install  ./ibm-iaccess-*.rpm
RUN npm install -g npm
RUN npm install -g node-pre-gyp
RUN chown -R 1001:0 /app
USER 1001
RUN cp /app/.odbc.ini $HOME

# install & start app
RUN npm i
CMD ["echo", "-- App Start --"]
