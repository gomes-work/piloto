FROM node:7.4-wheezy
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json /usr/src/app/
ARG PROXY
RUN npm config set proxy $PROXY && \ 
		npm config set https-proxy $PROXY && \
  		npm config set strict-ssl false && \
         npm install
#RUN npm install

COPY . /usr/src/app/

EXPOSE 8080
CMD [ "npm", "start" ]
