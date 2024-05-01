# FROM node:21-alpine3.18

# # Set working directory
# WORKDIR /app
# EXPOSE 3000
# # 
# COPY package.json /app/package.json
# COPY package-lock.json /app/package-lock.json

# # Same as npm install
# # RUN npm ci
# RUN npm cache clean --force && \
#     npm install -g npm@latest && \
#     npm install

# COPY . /app

# ENV CI=false
# ENV PORT=3000

# #CMD [ "npm", "start" ]

# build environment
FROM node:alpine as build
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
