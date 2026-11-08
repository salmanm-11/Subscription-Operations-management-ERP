$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.21.21-hotspot"
$sdk = "D:\mess project\android-sdk"
$sdkmanager = "$sdk\cmdline-tools\latest\bin\sdkmanager.bat"

Write-Host "Accepting Android SDK licenses..."
"y`ny`ny`ny`ny`ny`ny`ny`ny" | & $sdkmanager --sdk_root=$sdk --licenses

Write-Host "Installing platforms;android-34 and build-tools;34.0.0..."
& $sdkmanager --sdk_root=$sdk "platforms;android-34" "build-tools;34.0.0"

Write-Host "Done!"
