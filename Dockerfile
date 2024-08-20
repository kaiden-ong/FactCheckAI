# Use a Node.js base image
FROM node:20.16.0-alpine AS node-base

# Set the working directory
WORKDIR /app

# Copy Node.js project files
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci --omit=dev

# Copy the client folder and build the React app
COPY client/ ./client
WORKDIR /app/client
RUN npm ci --omit=dev
RUN npm run build

# Go back to the root directory
WORKDIR /app

# Copy the rest of the server files
COPY . .

# Use Python base image to install Python dependencies
FROM python:3.10-slim AS python-base

# Set the working directory for Python
WORKDIR /app

# Install Node.js in the Python image
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy Python requirements file
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Create the directory for NLTK data
RUN mkdir -p /root/nltk_data

# Set NLTK_DATA environment variable
ENV NLTK_DATA=/root/nltk_data

# Download NLTK data to the specified directory
RUN python -c "import nltk; nltk.download('punkt', download_dir='/root/nltk_data')"
RUN python -m textblob.download_corpora

# Copy Node.js build output to the Python image
COPY --from=node-base /app/client/build /app/client/build

# Copy the rest of the server files
COPY --from=node-base /app /app

# Expose the port for the application
EXPOSE 3000

# Start the Node.js application
CMD ["npm", "start"]
