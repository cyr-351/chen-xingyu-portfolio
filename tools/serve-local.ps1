Add-Type -AssemblyName System.Web

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$port = 8765
$listener = New-Object System.Net.HttpListener

function Get-ContentType([string]$path) {
  switch ([IO.Path]::GetExtension($path).ToLowerInvariant()) {
    ".html" { "text/html; charset=utf-8"; break }
    ".css" { "text/css; charset=utf-8"; break }
    ".js" { "application/javascript; charset=utf-8"; break }
    ".png" { "image/png"; break }
    ".jpg" { "image/jpeg"; break }
    ".jpeg" { "image/jpeg"; break }
    ".webp" { "image/webp"; break }
    ".mp4" { "video/mp4"; break }
    ".txt" { "text/plain; charset=utf-8"; break }
    default { "application/octet-stream" }
  }
}

while ($true) {
  try {
    $prefix = "http://127.0.0.1:$port/"
    $listener.Prefixes.Clear()
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    break
  } catch {
    $port++
    if ($port -gt 8799) {
      Write-Host "无法启动本地服务，请尝试双击“打开作品集.bat”。"
      pause
      exit 1
    }
  }
}

$url = "http://127.0.0.1:$port/index.html"
Write-Host ""
Write-Host "作品集本地展示服务已启动：$url"
Write-Host "展示结束后，在此窗口按 Ctrl + C 关闭服务。"
Write-Host ""
Start-Process $url

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [System.Web.HttpUtility]::UrlDecode($context.Request.Url.AbsolutePath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $requestPath = $requestPath -replace "/", [IO.Path]::DirectorySeparatorChar
    $target = [IO.Path]::GetFullPath((Join-Path $root $requestPath))

    if (-not $target.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
      $context.Response.StatusCode = 403
      $context.Response.Close()
      continue
    }

    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) {
      $context.Response.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
      $context.Response.Close()
      continue
    }

    $bytes = [IO.File]::ReadAllBytes($target)
    $context.Response.ContentType = Get-ContentType $target
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.Close()
  }
} finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}

