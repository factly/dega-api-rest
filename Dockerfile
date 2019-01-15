## To do:
# Add Dockerfile.dev
# Bookmark node_modules directory in docker-compose

# build stage
FROM node:10.14.2-alpine
ENV APP_ROOT /app

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm install
#RUN npm run build

ENV HOST 0.0.0.0
CMD ["npm", "run", "start"]
