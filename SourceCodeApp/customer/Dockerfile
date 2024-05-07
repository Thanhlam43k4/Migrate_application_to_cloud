FROM node:14

WORKDIR /app

COPY . /app

# RUN npm cache clean --force
RUN npm install

RUN npm install bcryptjs

COPY . . 

CMD ["npm","run","dev"]