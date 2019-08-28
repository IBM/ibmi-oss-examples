# nginx SSL proxy

It may be advantageous to use nginx as a front-end to existing web applications, including websites, REST/microservices, etc. This example shows how one might use NGINX to handle SSL configurations, but proxying all other work to another HTTP server. In particular, this allows for more standard SSL configuration, and also can enable TLS 1.3 if the existing application stack does not suppor this new protocol. 

The `nginx.conf` file provided here can be used mostly as-is, but you will want to modify a few things, for instance:
 - replace the port numbers (for the `listen` directive and the `proxy_pass` value) to suit your needs. This example listens on port 8443 and proxies to 6001
 - replace paths throughout the doc with the correct paths for your application.
