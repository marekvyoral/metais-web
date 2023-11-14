FROM nginx:stable

LABEL maintainer "marcel.glasa@isdd.sk"

ARG BUILD_DIR
ARG USER=nginx
ENV HOME /usr/share/nginx/html

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN chgrp -R root /var/cache/nginx
#RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf

# Copy the React web app
COPY ${BUILD_DIR} /usr/share/nginx/html
COPY ./docker/nginx.default.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 8080

RUN addgroup ${USER} root
USER ${USER}
#WORKDIR ${HOME}

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]