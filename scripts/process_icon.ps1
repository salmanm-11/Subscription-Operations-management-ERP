Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\user\.gemini\antigravity\brain\ed47bfe2-a268-477d-a855-085a758eb452\.user_uploaded\media_1793443515145_92cbb528.jpg"
$destPng = "d:\mess project\public\app-icon.png"
$buildPng = "d:\mess project\build\icon.png"
$buildIco = "d:\mess project\build\icon.ico"
$publicIco = "d:\mess project\public\favicon.ico"

# Ensure build and public directories exist
New-Item -ItemType Directory -Force -Path "d:\mess project\build" | Out-Null
New-Item -ItemType Directory -Force -Path "d:\mess project\public" | Out-Null

$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Original Image size: $($img.Width)x$($img.Height)"

# Save full-res PNG
$img.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Save($buildPng, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved PNG to $destPng and $buildPng"

# Generate 256x256 icon
$size = 256
$bmp256 = New-Object System.Drawing.Bitmap($size, $size)
$graph = [System.Drawing.Graphics]::FromImage($bmp256)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graph.DrawImage($img, 0, 0, $size, $size)
$graph.Dispose()

# Convert bitmap to ICO
$hIcon = $bmp256.GetHicon()
$ico = [System.Drawing.Icon]::FromHandle($hIcon)

# Save ICO
$fs = New-Object System.IO.FileStream($buildIco, [System.IO.FileMode]::Create)
$ico.Save($fs)
$fs.Close()

$fs2 = New-Object System.IO.FileStream($publicIco, [System.IO.FileMode]::Create)
$ico.Save($fs2)
$fs2.Close()

$ico.Dispose()
[System.Runtime.InteropServices.Marshal]::DestroyIcon($hIcon) | Out-Null
$bmp256.Dispose()
$img.Dispose()

Write-Host "Icons generated successfully in public/ and build/!"
