# Use Node.js LTS image (Bookworm for better GLIBC compatibility)
FROM node:18-bookworm

# Install FFmpeg and other dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild native modules
RUN npm install --production --build-from-source

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p temp public/campaigns

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
