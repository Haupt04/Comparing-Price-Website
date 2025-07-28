# 1. Base image
FROM node:18-slim

# 2. Install Chromium deps (for Puppeteer if scraping)
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

# 3. Set working dir
WORKDIR /app

# 4. Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend

# 5. Install frontend deps and build
WORKDIR /app/frontend
RUN npm install && npm run build

# 6. Move dist to backend
RUN cp -r dist ../backend/dist

# 7. Install backend deps
WORKDIR /app/backend
RUN npm install

# 8. Expose port
EXPOSE 3001

# 9. Set env
ENV NODE_ENV=production

# 10. Start backend
CMD ["node", "index.js"]
