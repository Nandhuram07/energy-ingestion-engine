# Quick Reference - Energy Ingestion Engine

## 🚀 Quick Start Commands

### Start Application (Local Development)

```bash
# Navigate to backend
cd c:\Users\srini\OneDrive\project\energy-ingestion-engine\energy-ingestion

# Install dependencies (first time only)
npm install

# Start development server
npm run start:dev
```

**Application URL**: http://localhost:3000

---

## 🧪 Test Commands

### Run Automated Test Script

```powershell
cd c:\Users\srini\OneDrive\project\energy-ingestion-engine
.\test-api.ps1
```

### Manual API Tests (PowerShell)

**Send Meter Data**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body '{"type":"meter","meterId":"M1","kwhConsumedAc":10.5,"voltage":220,"timestamp":"2026-02-09T10:00:00Z"}'
```

**Send Vehicle Data**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body '{"type":"vehicle","vehicleId":"V1","soc":75,"kwhDeliveredDc":8.5,"batteryTemp":32,"timestamp":"2026-02-09T10:00:00Z"}'
```

**Get Analytics**:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/v1/analytics/performance/V1"
```

---

## 🐳 Docker Commands

### Start with Docker

```bash
cd c:\Users\srini\OneDrive\project\energy-ingestion-engine

# Start all services
docker compose up --build

# Or run in background
docker compose up -d --build
```

### View Logs

```bash
# All logs
docker compose logs -f

# Only app logs
docker compose logs -f app
```

### Stop Services

```bash
# Stop containers
docker compose down

# Stop and remove all data
docker compose down -v
```

---

## 🗄️ Database Commands

### Connect to PostgreSQL (Local)

```bash
psql -U postgres -d energy_db
```

### Connect to PostgreSQL (Docker)

```bash
docker exec -it energy-db psql -U postgres -d energy_db
```

### Useful SQL Queries

```sql
-- View all tables
\dt

-- View meter history
SELECT * FROM meter_history ORDER BY timestamp DESC LIMIT 10;

-- View current meter state
SELECT * FROM meter_live;

-- View vehicle history
SELECT * FROM vehicle_history ORDER BY timestamp DESC LIMIT 10;

-- View current vehicle state
SELECT * FROM vehicle_live;

-- Count records
SELECT COUNT(*) FROM meter_history;
SELECT COUNT(*) FROM vehicle_history;

-- Check indexes
\d meter_history
\d vehicle_history
```

---

## 📋 Prerequisites Checklist

Before running the application:

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 15+ installed and running
- [ ] Database `energy_db` created
- [ ] `.env` file configured in `energy-ingestion` folder
- [ ] Dependencies installed (`npm install`)

---

## 🔧 Troubleshooting

### Application won't start

1. Check PostgreSQL is running: `psql -U postgres`
2. Verify `.env` file exists and has correct credentials
3. Check port 3000 is not in use

### Database connection error

1. Verify PostgreSQL service is running
2. Check credentials in `.env` match PostgreSQL setup
3. Ensure database `energy_db` exists

### Docker not working

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Run `docker --version` to verify installation

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and API documentation |
| `SETUP_GUIDE.md` | Detailed setup and deployment instructions |
| `test-api.ps1` | Automated API testing script |
| `energy-ingestion/.env` | Environment configuration |
| `docker-compose.yml` | Docker deployment configuration |

---

## 🎯 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/v1/telemetry` | Ingest meter or vehicle telemetry |
| GET | `/v1/analytics/performance/:vehicleId` | Get 24-hour performance metrics |

---

## 💡 Next Steps

1. **Setup**: Follow [SETUP_GUIDE.md](file:///c:/Users/srini/OneDrive/project/energy-ingestion-engine/SETUP_GUIDE.md)
2. **Test**: Run `.\test-api.ps1` to verify everything works
3. **Deploy**: Use Docker Compose for production deployment
4. **Extend**: Add authentication, monitoring, and additional features

---

## 📞 Support

For detailed instructions, see:
- **Setup Guide**: `SETUP_GUIDE.md`
- **Project README**: `README.md`
- **Implementation Details**: Check the walkthrough artifact
