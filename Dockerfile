# 1. Base image
FROM node:18-slim

# 2. Install Chromium + dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
  chromium-browser \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libnss3 \
  lsb-release \
  xdg-utils \
  wget \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# 3. Set working directory inside container
WORKDIR /app

# 4. Copy backend package.json and package-lock.json (if any)
COPY backend/package*.json ./backend/

# 5. Copy frontend package.json and package-lock.json (if any)
COPY frontend/package*.json ./frontend/

# 6. Install backend dependencies
RUN cd backend && npm install

# 7. Install frontend dependencies and build frontend
RUN cd frontend && npm install && npm run build

# 8. Copy entire project into the container
COPY . .

# 9. Expose backend port (update if different)
EXPOSE 3001

# 10. Set environment variable for production to serve static frontend from backend
ENV NODE_ENV=production

# 11. Start backend app
CMD ["node", "backend/index.js"]
