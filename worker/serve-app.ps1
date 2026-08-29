# Static HTTP Server for Logger Local Preview
# Serves Project-FlickShelft on http://localhost:5000

$port = 5000
$root = "C:\Users\adity\.gemini\antigravity\scratch\Project-FlickShelft"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".txt"  = "text/plain; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Logger Local Preview Web Server          " -ForegroundColor Cyan
Write-Host " Local App URL: http://localhost:$port/   " -ForegroundColor Green
Write-Host " Press Ctrl+C to stop                     " -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

$listener.Start()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # Add CORS & Security headers
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")

    if ($request.HttpMethod -eq "OPTIONS") {
      $response.StatusCode = 204
      $response.Close()
      continue
    }

    $rawPath = $request.Url.AbsolutePath.TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($rawPath)) {
      $rawPath = "index.html"
    }

    $filePath = Join-Path $root $rawPath
    if (-not (Test-Path $filePath -PathType Leaf)) {
      # Fallback to index.html for SPA routes
      $filePath = Join-Path $root "index.html"
    }

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $response.ContentType = $contentType
      $response.StatusCode = 200
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
      $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $response.ContentLength64 = $errBytes.Length
      $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
    }

    $response.Close()
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
