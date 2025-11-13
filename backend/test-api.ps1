# Test OAuth Login API
# This script tests the login endpoint with a Firebase ID token

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing OAuth Backend API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080"

# Test 1: Health Check
Write-Host "`n[1] Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/health" -Method Get
    Write-Host "✓ Health check passed!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor Gray
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
    Write-Host "Make sure the backend is running on port 8080" -ForegroundColor Yellow
    exit 1
}

# Test 2: Login with Firebase Token
Write-Host "`n[2] Testing Login Endpoint..." -ForegroundColor Yellow
Write-Host "NOTE: You need a valid Firebase ID token from your mobile app" -ForegroundColor Cyan
Write-Host "To get the token:" -ForegroundColor Cyan
Write-Host "  1. Login via Google on your mobile app" -ForegroundColor Gray
Write-Host "  2. Add console.log in frontend after successful Google login" -ForegroundColor Gray
Write-Host "  3. Copy the idToken from the console" -ForegroundColor Gray
Write-Host "  4. Paste it here" -ForegroundColor Gray

$firebaseToken = Read-Host "`nEnter Firebase ID Token (or press Enter to skip)"

if ($firebaseToken) {
    $loginData = @{
        firebaseIdToken = $firebaseToken
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginData -ContentType "application/json"
        Write-Host "✓ Login successful!" -ForegroundColor Green
        Write-Host "`nUser Info:" -ForegroundColor Cyan
        Write-Host ($response.user | ConvertTo-Json -Depth 3) -ForegroundColor Gray
        Write-Host "`nAccess Token:" -ForegroundColor Cyan
        Write-Host $response.accessToken -ForegroundColor Gray
        
        # Save token for further tests
        $global:accessToken = $response.accessToken
        
        # Test 3: Get User Info
        Write-Host "`n[3] Testing Get User Info Endpoint..." -ForegroundColor Yellow
        $headers = @{
            "Authorization" = "Bearer $global:accessToken"
        }
        $userInfo = Invoke-RestMethod -Uri "$baseUrl/api/users/me" -Method Get -Headers $headers
        Write-Host "✓ User info retrieved!" -ForegroundColor Green
        Write-Host ($userInfo | ConvertTo-Json -Depth 3) -ForegroundColor Gray
        
    } catch {
        Write-Host "✗ Login failed: $_" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $reader.DiscardBufferedData()
            $responseBody = $reader.ReadToEnd()
            Write-Host "Error details: $responseBody" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Skipping login test" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
