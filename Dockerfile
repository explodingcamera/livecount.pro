FROM kyma/docker-nginx

COPY app/nginx.conf /etc/nginx/nginx.conf
COPY build/ /var/www

CMD 'nginx'
