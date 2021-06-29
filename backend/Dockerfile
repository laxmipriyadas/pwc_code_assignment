FROM node:10.18.1

# Set the work directory
RUN mkdir -p /var/www/app
RUN mkdir -p /var/log/pm2_log/bira_api_log
WORKDIR /var/www/app

# Add our package.json and install *before* adding our application files
ADD package*.json ./
RUN npm i 

# Install pm2 *globally* so we can run our application
RUN npm i -g pm2

# Add application files
#ADD . /var/www/app
COPY . ./

#EXPOSE 9000

CMD ["pm2-runtime", "ecosystem.json", "--no-daemon"]


