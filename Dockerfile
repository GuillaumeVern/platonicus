FROM node:alpine

WORKDIR /

RUN apk add git

RUN git clone https://github.com/GuillaumeVern/platonicus

WORKDIR platonicus

RUN git pull && \
    npm install -g @angular/cli && \
    npm install

EXPOSE 4200

CMD ["sh", "-c", "git pull; ng serve --host 0.0.0.0"]
