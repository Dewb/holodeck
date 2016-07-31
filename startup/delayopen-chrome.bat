@echo off
echo Waiting to start holodeck phraseboard client...
timeout /t 10
@echo on
start "Chrome" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" -kiosk -fullscreen --app=http://localhost:9966