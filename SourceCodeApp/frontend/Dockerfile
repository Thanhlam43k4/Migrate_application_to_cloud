FROM node:20.15

WORKDIR /app

COPY . /app

# RUN npm cache clean --force
RUN npm install

COPY . . 

CMD ["npm","start"]