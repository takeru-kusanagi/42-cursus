#!/bin/sh

set -e

if [ ! -f "wp-config.php" ]; then
    wp core download --allow-root

    wp config create --allow-root \
        --dbname=$SQL_DATABASE \
        --dbuser=$SQL_USER \
        --dbpass=$SQL_PASSWORD \
        --dbhost=mariadb:3306

    wp core install --allow-root \
        --url=$DOMAIN_NAME \
        --title=$SITE_TITLE \
        --admin_user=$ADMIN_USER \
        --admin_password=$ADMIN_PASSWORD \
        --admin_email=$ADMIN_EMAIL

    wp user create $USER_LOGIN $USER_EMAIL --role=author --user_pass=$USER_PASSWORD --allow-root
fi

exec "$@"
