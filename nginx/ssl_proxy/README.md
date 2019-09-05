# nginx SSL proxy

It may be advantageous to use nginx as a front-end to existing web applications, including websites, REST/microservices, etc. This example shows how one might use NGINX to handle SSL configurations, but proxying all other work to another HTTP server. In particular, this allows for more standard SSL configuration, and also can enable TLS 1.3 if the existing application stack does not suppor this new protocol. 

# Modifications needed for your deployment

The `nginx.conf` sample file provided here can be used mostly as-is, but you will want to modify a few things, for instance:
 - replace the port numbers (for the `listen` directive and the `proxy_pass` value) to suit your needs. This example listens on port 8443 and proxies to 6001
 - replace paths throughout the doc with the correct paths for your application.
 - this sample `nginx.conf` assumes you have a directory with static content that you'd like to also serve up directly from nginx. If you do not have this need, you can remove this section (search for `location /static` and remove the `{}`-delimited section after it. 
 
# SSL Certificate generation
As you may see, the sample `nginx.conf` file references an SSL Certificate (`ssl_certificate`) and key (`ssl_certificate_key`). You will need to generate this certificate for your deployment. You can find some good tutorials online, including https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs
