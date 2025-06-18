FROM cockroachdb/cockroach:latest

COPY docker/init/db.sh /init-db.sh
RUN chmod +x /init-db.sh

ENTRYPOINT ["/init-db.sh"]