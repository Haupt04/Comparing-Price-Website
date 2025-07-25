# 1. Base image
FROM node:18-slim

# 2. Install Chromium dependencies
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

# 4. Copy backend and frontend code fully
COPY backend ./backend
COPY frontend ./frontend

# 5. Install backend dependencies
RUN cd backend && npm install

# 6. Install frontend dependencies and build it
RUN cd frontend && npm install && npm run build

# 7. Expose port
EXPOSE 3001

# 8. Environment
ENV NODE_ENV=production

# 9. Start the backend
CMD ["node", "backend/index.js"]
