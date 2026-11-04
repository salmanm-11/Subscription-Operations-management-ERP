Add-Type -AssemblyName System.Drawing

$src = "C:\Users\user\.gemini\antigravity\brain\ed47bfe2-a268-477d-a855-085a758eb452\.user_uploaded\media_1793446907199_ad5bed47.jpg"
$img = [System.Drawing.Image]::FromFile($src)

$sizes = @(16, 24, 32, 48, 64, 128, 256)
$pngBytesList = @()

foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $s, $s)
    $g.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $pngBytesList += ,$ms.ToArray()
    $ms.Dispose()
    $bmp.Dispose()
}

$img.Dispose()

# Assemble multi-size ICO file with PNG payloads
$icoStream = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($icoStream)

# Header
$bw.Write([UInt16]0)                # Reserved
$bw.Write([UInt16]1)                # Type 1 = Icon
$bw.Write([UInt16]$sizes.Count)     # Number of images

# Calculate offset: header (6 bytes) + directory entries (16 * count)
$offset = 6 + (16 * $sizes.Count)

for ($i = 0; $i -lt $sizes.Count; $i++) {
    $s = $sizes[$i]
    $data = $pngBytesList[$i]
    $w = if ($s -ge 256) { 0 } else { $s }
    $h = if ($s -ge 256) { 0 } else { $s }

    $bw.Write([Byte]$w)             # Width
    $bw.Write([Byte]$h)             # Height
    $bw.Write([Byte]0)              # Color count
    $bw.Write([Byte]0)              # Reserved
    $bw.Write([UInt16]1)            # Color planes
    $bw.Write([UInt16]32)           # Bits per pixel
    $bw.Write([UInt32]$data.Length) # Image data size
    $bw.Write([UInt32]$offset)      # Offset of image data

    $offset += $data.Length
}

# Write image data
foreach ($data in $pngBytesList) {
    $bw.Write($data)
}

$bw.Flush()

# Write to build/icon.ico, public/favicon.ico, and app icon paths
$destPaths = @(
    "d:\mess project\build\icon.ico",
    "d:\mess project\public\favicon.ico",
    "d:\mess project\dist\favicon.ico"
)

foreach ($dp in $destPaths) {
    [System.IO.File]::WriteAllBytes($dp, $icoStream.ToArray())
}

$bw.Dispose()
$icoStream.Dispose()

Write-Host "Multi-resolution Windows icon generated successfully: $([System.IO.File]::ReadAllBytes('d:\mess project\build\icon.ico').Length) bytes"
