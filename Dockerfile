FROM node:16
WORKDIR /app
COPY package.json ./
COPY ./ ./
EXPOSE 3000
RUN npm i
RUN npm run build
CMD ["npm", "run", "start"]
