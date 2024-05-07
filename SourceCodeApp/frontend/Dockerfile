FROM node:14

WORKDIR /app

COPY . /app

# RUN npm cache clean --force
RUN npm install

COPY . . 

CMD ["npm","start"]