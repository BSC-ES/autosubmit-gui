#!/bin/sh

# Empty the /etc/nginx/conf.d/proxy.conf file
echo "" > /etc/nginx/conf.d/proxy.conf

# Add the proxy configuration to the /etc/nginx/conf.d/proxy.conf file in $API_URL_PROXY exists
if [ -n "$API_URL_PROXY" ]; then
  echo "location /api/ { proxy_pass $API_URL_PROXY; }" > /etc/nginx/conf.d/proxy.conf
fi  

# Start nginx
nginx -g "daemon off;"
