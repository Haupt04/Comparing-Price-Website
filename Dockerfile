# Use official Node image with slim Debian base
FROM node:18-slim

# Install Chromium and dependencies Puppeteer needs
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libpango-1.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libasound2 \
    libnss3 \
    libxss1 \
    libxtst6 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies (backend + frontend if needed)
COPY package*.json ./
RUN npm install

# Copy entire project files
COPY . .

# Build frontend (adjust if your frontend build command is different)
RUN npm install --prefix frontend
RUN npm run build --prefix frontend

# Set env var so Puppeteer knows where Chromium is
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expose backend port (adjust if different)
EXPOSE 3001

# Start your backend server (adjust path if your entry is different)
CMD ["node", "backend/index.js"]
