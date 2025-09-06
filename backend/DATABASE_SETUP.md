# Database Setup Instructions

## PostgreSQL Installation Complete! 🎉

### Next Steps:

1. **Start PostgreSQL Service**
   - Open "Services" in Windows
   - Find "postgresql" service
   - Start it if not running

2. **Create Database**
   ```sql
   -- Open pgAdmin or psql command line
   CREATE DATABASE synergysphere;
   ```

3. **Update .env File**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/synergysphere"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
   ```

4. **Run Database Migration**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```

6. **Test API**
   ```bash
   node test-api.js
   ```

### Default PostgreSQL Settings:
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: (the one you set during installation)
- **Database**: synergysphere

### Troubleshooting:
- If connection fails, check if PostgreSQL service is running
- Make sure the password in .env matches your PostgreSQL password
- Ensure port 5432 is not blocked by firewall
