
FROM debian:bookworm

RUN apt-get update && apt-get install -y \
    mariadb-server \
    && rm -rf /var/lib/apt/lists/*

COPY conf/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf

COPY tools/initial_db.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/initial_db.sh

RUN mkdir -p /var/run/mysqld && \
    chown -R mysql:mysql /var/run/mysqld && \
    chmod 777 /var/run/mysqld

ENTRYPOINT ["/usr/local/bin/initial_db.sh"]
CMD ["mysqld", "--user=mysql"]
