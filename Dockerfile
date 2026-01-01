# Sử dụng Node.js phiên bản ổn định và nhẹ
FROM node:20-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Thiết lập biến môi trường mặc định
ENV NODE_ENV=production
ENV DB_PATH=/app/data/notes.db
ENV MASTER_PASSWORD=admin123

# Cài đặt thư viện (tận dụng Docker cache)
COPY package*.json ./
RUN npm install --omit=dev

# Sao chép toàn bộ mã nguồn
COPY . .

# Tạo thư mục chứa database
RUN mkdir -p /app/data

# Mở port 3001
EXPOSE 3001

# Chạy ứng dụng
CMD ["node", "server.js"]
