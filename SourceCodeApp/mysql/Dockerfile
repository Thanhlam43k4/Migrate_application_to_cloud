FROM mysql:8.0.31



COPY setup.sql /docker-entrypoint-initdb.d/

# needed for intialization
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=customer_db;
ENV MYSQL_USER=root


EXPOSE 3306