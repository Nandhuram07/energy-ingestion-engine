# Test Data Population Script
# This script sends sample telemetry data to the API

$baseUrl = "http://localhost:3000/v1"

Write-Host "=== Energy Ingestion Engine - Test Script ===" -ForegroundColor Cyan
Write-Host ""

# Function to send telemetry
function Send-Telemetry {
    param($data)
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/telemetry" -Method Post -ContentType "application/json" -Body ($data | ConvertTo-Json)
        Write-Host "✓ Success: $($response.message)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Send Meter Data
Write-Host "Test 1: Sending Meter Telemetry..." -ForegroundColor Yellow
$meterData = @{
    type = "meter"
    meterId = "M1"
    kwhConsumedAc = 10.5
    voltage = 220
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
Send-Telemetry $meterData
Start-Sleep -Seconds 1

# Test 2: Send more meter data
Write-Host "Test 2: Sending more Meter Telemetry..." -ForegroundColor Yellow
$meterData2 = @{
    type = "meter"
    meterId = "M1"
    kwhConsumedAc = 15.2
    voltage = 225
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
Send-Telemetry $meterData2
Start-Sleep -Seconds 1

# Test 3: Send Vehicle Data
Write-Host "Test 3: Sending Vehicle Telemetry..." -ForegroundColor Yellow
$vehicleData = @{
    type = "vehicle"
    vehicleId = "V1"
    soc = 75
    kwhDeliveredDc = 8.5
    batteryTemp = 32
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
Send-Telemetry $vehicleData
Start-Sleep -Seconds 1

# Test 4: Send more vehicle data
Write-Host "Test 4: Sending more Vehicle Telemetry..." -ForegroundColor Yellow
$vehicleData2 = @{
    type = "vehicle"
    vehicleId = "V1"
    soc = 80
    kwhDeliveredDc = 12.3
    batteryTemp = 34
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
Send-Telemetry $vehicleData2
Start-Sleep -Seconds 1

# Test 5: Send data for another vehicle
Write-Host "Test 5: Sending data for Vehicle V2..." -ForegroundColor Yellow
$vehicleData3 = @{
    type = "vehicle"
    vehicleId = "V2"
    soc = 60
    kwhDeliveredDc = 5.5
    batteryTemp = 28
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
}
Send-Telemetry $vehicleData3
Start-Sleep -Seconds 2

# Test 6: Get Analytics for V1
Write-Host ""
Write-Host "Test 6: Fetching Analytics for Vehicle V1..." -ForegroundColor Yellow
try {
    $analytics = Invoke-RestMethod -Uri "$baseUrl/analytics/performance/V1"
    Write-Host "✓ Analytics Retrieved Successfully:" -ForegroundColor Green
    Write-Host "  Vehicle ID: $($analytics.vehicleId)" -ForegroundColor White
    Write-Host "  Period: $($analytics.period)" -ForegroundColor White
    Write-Host "  Total AC Consumed: $($analytics.metrics.totalAcConsumed) kWh" -ForegroundColor White
    Write-Host "  Total DC Delivered: $($analytics.metrics.totalDcDelivered) kWh" -ForegroundColor White
    Write-Host "  Efficiency: $($analytics.metrics.efficiency)" -ForegroundColor White
    Write-Host "  Avg Battery Temp: $($analytics.metrics.averageBatteryTemp)°C" -ForegroundColor White
}
catch {
    Write-Host "✗ Error fetching analytics: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
