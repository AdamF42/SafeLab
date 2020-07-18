FROM node:12.18.1-alpine3.12

# use the value to set the ENV var default
ENV INFLUX_URL=$INFLUX_URL
ENV INFLUX_TOKEN=$INFLUX_TOKEN
ENV ORG=$ORG
ENV BUCKET=$BUCKET
# Create app directory
WORKDIR /usr/src/app
ADD package*.json ./
ADD tsconfig.json ./


# Install all Packages
RUN npm i 

# Bundle app source
COPY . .

# If you are building your code for production
RUN npm run build:prod --only=production

CMD [ "npm", "run", "prod" ] 