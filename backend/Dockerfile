FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json if you have them at root
COPY package*.json ./

# Install root dependencies if any (optional)
RUN npm install

# Copy backend and frontend folders
COPY backend ./backend
COPY frontend ./frontend

# Install backend dependencies
RUN cd backend && npm install

# Install frontend dependencies and build frontend
RUN cd frontend && npm install && npm run build

# Expose backend port 3001
EXPOSE 3001

# Start backend server
CMD ["node", "backend/index.js"]
