# Start Angular dev server
Start-Process powershell -ArgumentList "ng serve --host 0.0.0.0 --port 4200" -NoNewWindow

# Wait a few seconds to let Angular start
Start-Sleep -Seconds 10

# Start ngrok tunnel
Start-Process powershell -ArgumentList "ngrok http 4200" -NoNewWindow