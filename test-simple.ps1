# Test Meter Data
Write-Host "Testing Meter Ingestion..." -ForegroundColor Yellow
$body = '{"type":"meter","meterId":"M1","kwhConsumedAc":10.5,"voltage":220,"timestamp":"2026-02-10T19:00:00Z"}'
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body $body
    Write-Host "SUCCESS: Meter data ingested" -ForegroundColor Green
    $response | ConvertTo-Json
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Vehicle Data
Write-Host "Testing Vehicle Ingestion..." -ForegroundColor Yellow
$body2 = '{"type":"vehicle","vehicleId":"V1","soc":75,"kwhDeliveredDc":8.5,"batteryTemp":32,"timestamp":"2026-02-10T19:00:00Z"}'
try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:3000/v1/telemetry" -Method Post -ContentType "application/json" -Body $body2
    Write-Host "SUCCESS: Vehicle data ingested" -ForegroundColor Green
    $response2 | ConvertTo-Json
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Analytics
Write-Host "Testing Analytics..." -ForegroundColor Yellow
try {
    $analytics = Invoke-RestMethod -Uri "http://localhost:3000/v1/analytics/performance/V1"
    Write-Host "SUCCESS: Analytics retrieved" -ForegroundColor Green
    $analytics | ConvertTo-Json -Depth 10
}
catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
