# Use Node.js to build React app
FROM node:22 as builder

WORKDIR /app
COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx to serve the static site
FROM nginx:alpine

# Copy built React files to Nginx's default public folder
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
