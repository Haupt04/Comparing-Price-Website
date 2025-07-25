# 1. Base image
FROM node:18-slim

# 2. Install Chromium dependencies (NOT the browser itself)
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

# 3. Set working directory inside container
WORKDIR /app

# 4. Copy backend and frontend package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# 5. Install backend dependencies (including puppeteer)
RUN cd backend && npm install

# 6. Install frontend and build
RUN cd frontend && npm install && npm run build

# 7. Copy full source
COPY . .

# 8. Expose port
EXPOSE 3001

# 9. Set environment
ENV NODE_ENV=production

# 10. Start backend
CMD ["node", "backend/index.js"]
