FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# O Vite precisa escutar em todas as interfaces dentro do container.
CMD ["npm", "run", "dev", "--", "--host"]
