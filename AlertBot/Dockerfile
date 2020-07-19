FROM node:12.18.1

# use the value to set the ENV var default
ENV TELEGRAM_TOKEN=$TELEGRAM_TOKEN
ENV CHAT_ID=$CHAT_ID

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