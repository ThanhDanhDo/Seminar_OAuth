@echo off
echo ========================================
echo Checking Backend Status
echo ========================================
echo.

echo [1] Checking if backend is running...
curl -s http://localhost:8080/api/auth/health
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Backend is not running!
    echo Please start backend with: mvn spring-boot:run
    pause
    exit /b 1
)

echo.
echo.
echo [2] Backend is UP! Ready to test.
echo.
echo Next steps:
echo 1. Open mobile app and login with Google
echo 2. Copy the Firebase ID Token from console
echo 3. Run: test-api.ps1
echo 4. Paste the token when prompted
echo.
pause
