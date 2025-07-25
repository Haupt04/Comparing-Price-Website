# Use Node 20 for compatibility with all modern packages
FROM node:20-slim

# Install dependencies needed for Chromium (used by Puppeteer)
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

# Set working directory
WORKDIR /app

# Copy package files first to cache dependencies
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies (includes Puppeteer)
RUN cd backend && npm install

# Install frontend dependencies and build it
RUN cd frontend && npm install && npm run build

# Copy rest of the project files
COPY . .

# Optional: If backend serves frontend statically
# Ensure your backend code serves ./frontend/dist

# Expose backend port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Start backend
CMD ["node", "backend/index.js"]
