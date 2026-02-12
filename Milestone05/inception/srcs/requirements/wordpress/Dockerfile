
FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    php8.2-fpm \
    php8.2-mysql \
    mariadb-client \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

RUN sed -i 's|listen = /run/php/php8.2-fpm.sock|listen = 9000|g' /etc/php/8.2/fpm/pool.d/www.conf

WORKDIR /var/www/html

COPY tools/wp_start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/wp_start.sh

RUN mkdir -p /run/php

ENTRYPOINT ["/usr/local/bin/wp_start.sh"]
CMD ["/usr/sbin/php-fpm8.2", "-F"]
