
FROM node:21-alpine3.18

# Set working directory
WORKDIR /app
EXPOSE 3000
# 
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install
# RUN npm ci
RUN npm i

COPY . /app

ENV CI=false
ENV PORT=3000

CMD [ "npm", "start" ]
