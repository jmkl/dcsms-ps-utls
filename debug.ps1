uxp service start &
Start-Sleep -Seconds 1
uxp plugin load &
Start-Sleep -Seconds 1
uxp plugin watch &
Start-Sleep -Seconds 1
Set-Location -Path .
Start-Sleep -Seconds 1
uxp plugin debug &