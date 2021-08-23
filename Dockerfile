FROM node:lts-alpine as build-stage

# make the "app" folder the current working directory
WORKDIR /app
# copy both "package.json" and "package-lock.json" (if available)
COPY package*.json ./
# install project dependencies
RUN npm ci
# copy project files and folders to the current working directory (i.e. "app" folder)
COPY . .

# build add for productin 
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]