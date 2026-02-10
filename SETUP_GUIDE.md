# Step-by-Step Execution Guide

This guide provides detailed instructions to set up, test, and deploy the Energy Ingestion Engine.

---

## Prerequisites

Before starting, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **PostgreSQL 15+** installed ([Download](https://www.postgresql.org/download/))
3. **Docker Desktop** (optional, for containerized deployment) ([Download](https://www.docker.com/products/docker-desktop/))

---

## Part 1: Local Development Setup (Without Docker)

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, set the password for the `postgres` user (remember this!)
3. Ensure PostgreSQL is running on port 5432

### Step 2: Create Database

Open **pgAdmin** or use **psql** command line:

```sql
CREATE DATABASE energy_db;
```

Or via command line:
```bash
psql -U postgres
CREATE DATABASE energy_db;
\q
```

### Step 3: Configure Environment

Navigate to the backend directory:
```bash
cd c:\Users\srini\OneDrive\project\energy-ingestion-engine\energy-ingestion
```

Edit the `.env` file and update with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=energy_db
PORT=3000
NODE_ENV=development
```

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Start the Application

```bash
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3000
```

### Step 6: Verify Database Tables

The application will automatically create the required tables. Verify using pgAdmin or psql:

```sql
\c energy_db
\dt

-- You should see:
-- meter_history
-- meter_live
-- vehicle_history
-- vehicle_live
```

---

## Part 2: Testing the API

### Option A: Using PowerShell Test Script (Recommended)

1. Open a new PowerShell window
2. Navigate to the project root:
   ```powershell
   cd c:\Users\srini\OneDrive\project\energy-ingestion-engine
   ```

3. Run the test script:
   ```powershell
   .\test-api.ps1
   ```

This will:
- Send multiple meter telemetry records
- Send multiple vehicle telemetry records
- Fetch analytics for a vehicle
- Display results in color-coded output

### Option B: Manual Testing with PowerShell

**Test Meter Ingestion:**
```powershell
$meterData = @{
    type = "meter"
    meterId = "M1"
    kwhConsumedAc = 10.5
    voltage = 220
    timestamp = "2026-02-09T10:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body $meterData
```

**Test Vehicle Ingestion:**
```powershell
$vehicleData = @{
    type = "vehicle"
    vehicleId = "V1"
    soc = 75
    kwhDeliveredDc = 8.5
    batteryTemp = 32
    timestamp = "2026-02-09T10:00:00Z"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body $vehicleData
```

**Test Analytics:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/v1/analytics/performance/V1"
```

### Option C: Using cURL (if installed)

```bash
# Meter data
curl -X POST http://localhost:3000/v1/telemetry -H "Content-Type: application/json" -d "{\"type\":\"meter\",\"meterId\":\"M1\",\"kwhConsumedAc\":10.5,\"voltage\":220,\"timestamp\":\"2026-02-09T10:00:00Z\"}"

# Vehicle data
curl -X POST http://localhost:3000/v1/telemetry -H "Content-Type: application/json" -d "{\"type\":\"vehicle\",\"vehicleId\":\"V1\",\"soc\":75,\"kwhDeliveredDc\":8.5,\"batteryTemp\":32,\"timestamp\":\"2026-02-09T10:00:00Z\"}"

# Analytics
curl http://localhost:3000/v1/analytics/performance/V1
```

### Option D: Using Postman

1. Download Postman: https://www.postman.com/downloads/
2. Create a new POST request to `http://localhost:3000/v1/telemetry`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
     "type": "meter",
     "meterId": "M1",
     "kwhConsumedAc": 10.5,
     "voltage": 220,
     "timestamp": "2026-02-09T10:00:00Z"
   }
   ```
5. Click Send

---

## Part 3: Verify Data in Database

### Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Navigate to: Servers → PostgreSQL → Databases → energy_db → Schemas → public → Tables
4. Right-click on `meter_history` → View/Edit Data → All Rows
5. Verify your test data is present

### Using psql Command Line

```bash
psql -U postgres -d energy_db

-- View meter history
SELECT * FROM meter_history ORDER BY timestamp DESC LIMIT 10;

-- View current meter state
SELECT * FROM meter_live;

-- View vehicle history
SELECT * FROM vehicle_history ORDER BY timestamp DESC LIMIT 10;

-- View current vehicle state
SELECT * FROM vehicle_live;

-- Check indexes
\d meter_history
\d vehicle_history

-- Exit
\q
```

---

## Part 4: Docker Deployment (If Docker is Installed)

### Step 1: Install Docker Desktop

1. Download from: https://www.docker.com/products/docker-desktop/
2. Install and restart your computer
3. Start Docker Desktop

### Step 2: Build and Run with Docker Compose

```bash
cd c:\Users\srini\OneDrive\project\energy-ingestion-engine

# Start all services (PostgreSQL + App)
docker compose up --build

# Or run in detached mode
docker compose up -d --build
```

### Step 3: Verify Services are Running

```bash
# Check running containers
docker ps

# You should see:
# - energy-db (PostgreSQL)
# - energy-app (NestJS application)
```

### Step 4: View Logs

```bash
# View all logs
docker compose logs -f

# View only app logs
docker compose logs -f app

# View only database logs
docker compose logs -f postgres
```

### Step 5: Test the API

Use the same testing methods from Part 2, but the application will be running in Docker.

### Step 6: Access Database in Docker

```bash
# Connect to PostgreSQL container
docker exec -it energy-db psql -U postgres -d energy_db

# Run queries
SELECT * FROM meter_history LIMIT 10;

# Exit
\q
```

### Step 7: Stop Services

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (deletes all data)
docker compose down -v
```

---

## Part 5: Manual Production Deployment (No Docker)

If you cannot or do not want to use Docker, you can deploy the application directly on the host machine. This requires Node.js and PostgreSQL to be installed.

### Step 1: Install Process Manager (PM2)

PM2 is a production process manager for Node.js that keeps your application running in the background, restarts it on crashes, and manages logs.

```bash
npm install -g pm2
```

### Step 2: Build the Application

Compile the TypeScript code into optimized JavaScript.

```bash
cd energy-ingestion
npm run build
```

The compiled code will be in the `dist/` folder.

### Step 3: Start the Application

**Option A: Run in Background with PM2 (Recommended)**

This is equivalent to `docker compose up -d`.

```bash
# Start the application
pm2 start dist/main.js --name energy-engine

# Save list of processes to respawn on reboot
pm2 save
```

**Option B: Run in Foreground**

This is equivalent to running `npm run start`.

```powershell
# Set environment to production
$env:NODE_ENV="production"

# Start the application
npm run start:prod
```

### Step 4: Manage the Application

**View Logs (Equivalent to `docker logs`)**:
```bash
pm2 logs energy-engine
```

**Check Status (Equivalent to `docker ps`)**:
```bash
pm2 status
```

**Stop Application (Equivalent to `docker stop`)**:
```bash
pm2 stop energy-engine
```

**Restart Application**:
```bash
pm2 restart energy-engine
```

### Step 5: Database Maintenance

Since you are not using Docker, you are responsible for maintaining your PostgreSQL database.

**Backup Database**:
```bash
pg_dump -U postgres energy_db > backup.sql
```

**Restore Database**:
```bash
psql -U postgres energy_db < backup.sql
```

---

## Part 6: Load Testing

### Create Multiple Records

Run this PowerShell script to create 100 records:

```powershell
$baseUrl = "http://localhost:3000/v1"

for ($i = 1; $i -le 100; $i++) {
    $meterData = @{
        type = "meter"
        meterId = "M$i"
        kwhConsumedAc = Get-Random -Minimum 5 -Maximum 20
        voltage = Get-Random -Minimum 210 -Maximum 230
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$baseUrl/telemetry" -Method Post -ContentType "application/json" -Body $meterData
    
    $vehicleData = @{
        type = "vehicle"
        vehicleId = "V$i"
        soc = Get-Random -Minimum 20 -Maximum 100
        kwhDeliveredDc = Get-Random -Minimum 5 -Maximum 15
        batteryTemp = Get-Random -Minimum 25 -Maximum 40
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "$baseUrl/telemetry" -Method Post -ContentType "application/json" -Body $vehicleData
    
    Write-Host "Created records for device $i"
}

Write-Host "Load test complete! Created 200 records (100 meters + 100 vehicles)"
```

---

## Part 7: Troubleshooting

### Issue: Application won't start

**Solution:**
1. Check if PostgreSQL is running
2. Verify database credentials in `.env`
3. Check if port 3000 is already in use
4. Review error logs in the console

### Issue: Cannot connect to database

**Solution:**
1. Verify PostgreSQL is running: `psql -U postgres`
2. Check if database exists: `\l` in psql
3. Verify credentials in `.env` file
4. Check firewall settings

### Issue: Docker containers won't start

**Solution:**
1. Ensure Docker Desktop is running
2. Check Docker logs: `docker compose logs`
3. Verify ports 3000 and 5432 are not in use
4. Try rebuilding: `docker compose up --build --force-recreate`

### Issue: API returns validation errors

**Solution:**
1. Verify JSON payload format matches the DTOs
2. Check that `type` field is either "meter" or "vehicle"
3. Ensure all required fields are present
4. Verify timestamp is in ISO 8601 format

---

## Part 8: Deployment Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `energy_db` created
- [ ] Environment variables configured in `.env`
- [ ] Dependencies installed (`npm install`)
- [ ] Application starts successfully (`npm run start:dev`)
- [ ] Database tables created automatically
- [ ] Meter telemetry endpoint tested
- [ ] Vehicle telemetry endpoint tested
- [ ] Analytics endpoint tested
- [ ] Data verified in database
- [ ] Docker deployment tested (if using Docker)
- [ ] Load testing completed
- [ ] Production build tested

---

## Summary

You now have a fully functional Energy Ingestion Engine that can:

✅ Accept high-frequency telemetry from meters and vehicles  
✅ Store historical data for audit trails  
✅ Maintain current device state for dashboards  
✅ Provide fast analytical queries with indexed lookups  
✅ Scale horizontally with stateless API design  
✅ Deploy easily with Docker or run locally  

**Next Steps:**
1. Add authentication and authorization
2. Implement rate limiting
3. Add Swagger documentation
4. Set up monitoring and alerting
5. Configure database backups
6. Implement table partitioning for historical data
