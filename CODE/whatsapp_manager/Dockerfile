# Use minimal base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install required build/runtime dependencies
RUN apk add --no-cache ffmpeg python3 g++ make git

# Copy dependency files and install packages
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app source code
COPY . .

# Create runtime directories
RUN mkdir -p public/qr data/sessions

# Declare documented default ENV values (override at runtime using `-e`)
ENV PORT=8080
ENV SUPABASE_DATABASE_URL=https://vmpwbxbfrrpzcaeuhtba.supabase.co
ENV SUPABASE_DATABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcHdieGJmcnJwemNhZXVodGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDk4MjQsImV4cCI6MjA2Mjk4NTgyNH0.c1lhGi0kugi_KdcjGCuZrhrSC6WBs514iMjghNMgVIs
ENV SUPABASE_STORAGE_URL=https://vmpwbxbfrrpzcaeuhtba.supabase.co/storage/v1/s3
ENV SESSION_ID=session-Q3dmp5fTjBJcvr63HaBHkg
ENV SESSION_DIR=./data
ENV DEBUG=false
ENV CHURCH_ID=Q3dmp5fTjBJcvr63HaBHkg
ENV RABBITMQ_URL=amqp://zapbless:zapbless@rabbitmq-v1-services.argocd.svc.cluster.local:5672
ENV RABBITMQ_OUTBOUND_QUEUE=zapbless.outbound
ENV RABBITMQ_INBOUND_QUEUE=zapbless.inbound
ENV RABBITMQ_DISCONNECTED_SESSIONS_QUEUE=zapbless.disconnected.sessions

# Expose application port (for documentation; actual mapping done at runtime)
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
