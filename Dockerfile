# 1. Base image with Node 20+ for Puppeteer compatibility
FROM node:20-slim

# 2. Install Chromium dependencies
RUN apt-get update && apt-get install -y \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libxss1 \
  libgtk-3-0 \
  libnss3 \
  libxshmfence1 \
  libegl1 \
  xdg-utils \
  wget \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# 3. Create tmp dir with proper permissions
RUN mkdir -p /app/tmp && chmod -R 777 /tmp /app/tmp

# 4. Set working directory
WORKDIR /app

# 5. Copy backend and frontend package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 6. Install backend dependencies (includes Puppeteer)
RUN cd backend && npm install

# 7. Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# 8. Copy full source
COPY . .

# 9. Expose port
EXPOSE 3001

# 10. Environment variables
ENV NODE_ENV=production
ENV TMPDIR=/app/tmp

# 11. Start backend
CMD ["node", "backend/index.js"]
