# High-Scale Energy Ingestion Engine

A production-ready telemetry ingestion system designed to handle high-frequency data from Smart Meters and Electric Vehicles. Built with **NestJS**, **TypeScript**, and **PostgreSQL**.

## 🚀 Key Features

- **High-Throughput Ingestion**: Validated to handle high-frequency writes.
- **Hot/Cold Storage Architecture**:
  - **Cold Store**: Append-only audit trail (`meter_history`, `vehicle_history`).
  - **Hot Store**: UPSERT-based live state (`meter_live`, `vehicle_live`).
- **Polymorphic API**: Single endpoint handles multiple device types.
- **Optimized Analytics**: 24-hour efficiency analysis using composite indexes.
- **Docker Ready**: Full containerization support.

---

## 🛠️ Technology Stack

- **Backend**: NestJS (Node.js framework)
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM
- **Validation**: class-validator & class-transformer

---

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### 1. Installation

```bash
# Install dependencies
cd energy-ingestion
npm install
```

### 2. Configuration

Create a `.env` file in the `energy-ingestion` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=energy_db
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

Ensure PostgreSQL is running and create the database:

```sql
CREATE DATABASE energy_db;
```

### 4. Run Application

```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

The application will start at `http://localhost:3000`.

---

## 📡 API Documentation

### 1. Ingest Telemetry

**Endpoint**: `POST /v1/telemetry`

**Meter Payload**:
```json
{
  "type": "meter",
  "meterId": "M1",
  "kwhConsumedAc": 10.5,
  "voltage": 220,
  "timestamp": "2026-02-10T19:00:00Z"
}
```

**Vehicle Payload**:
```json
{
  "type": "vehicle",
  "vehicleId": "V1",
  "soc": 75,
  "kwhDeliveredDc": 8.5,
  "batteryTemp": 32,
  "timestamp": "2026-02-10T19:00:00Z"
}
```

### 2. Vehicle Analytics

**Endpoint**: `GET /v1/analytics/performance/:vehicleId`

**Response**:
```json
{
  "vehicleId": "V1",
  "period": "24 hours",
  "metrics": {
    "totalAcConsumed": "10.50",
    "totalDcDelivered": "8.50",
    "efficiency": "80.95%",
    "averageBatteryTemp": "32.00"
  }
}
```

---

## 🧪 Testing

A PowerShell test script is included to populate data and verify endpoints.

```powershell
.\test-simple.ps1
```

For manual testing, you can import the following curl commands:

```bash
# Ingest Meter Data
curl -X POST http://localhost:3000/v1/telemetry -H "Content-Type: application/json" -d '{"type":"meter","meterId":"M1","kwhConsumedAc":10.5,"voltage":220,"timestamp":"2026-02-10T19:00:00Z"}'

# Get Analytics
curl http://localhost:3000/v1/analytics/performance/V1
```

---

