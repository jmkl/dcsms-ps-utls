uxp service start &
Start-Sleep -Seconds 1
uxp plugin load &
uxp plugin watch &
Start-Sleep -Seconds 3
Set-Location -Path .
uxp plugin debug &