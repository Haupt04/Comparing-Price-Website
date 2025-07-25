# 1. Base image
FROM node:20-slim

# 2. Install Chromium dependencies (but NOT Chromium itself)
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libxss1 \
  libgtk-3-0 \
  libnss3 \
  libxshmfence1 \
  xdg-utils \
  wget \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# 3. Set working directory
WORKDIR /app

# 4. Prevent puppeteer from downloading Chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# 5. Copy full source
COPY . .

# 6. Install backend deps (including puppeteer, chromium)
WORKDIR /app/backend
RUN npm install

# 7. Install frontend and build
WORKDIR /app/frontend
RUN npm install && npm run build

# 8. Set back to backend as working directory
WORKDIR /app/backend

# 9. Expose port
EXPOSE 3001

# 10. Set environment
ENV NODE_ENV=production

# 11. Start backend
CMD ["node", "index.js"]
