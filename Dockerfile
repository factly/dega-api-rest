## To do:
# Add Dockerfile.dev
# Bookmark node_modules directory in docker-compose

# Set base image
FROM node:10.14.2-alpine
ENV APP_ROOT /app

# create and setup working directory
RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}

# install node modules
COPY ./package.json ${APP_ROOT}
RUN npm install

# copy source files to image and build
COPY . ${APP_ROOT}
#RUN npm run build

# give full external access to the app container
ENV HOST 0.0.0.0

# Primary command to run when the container starts
CMD ["npm", "start"]
