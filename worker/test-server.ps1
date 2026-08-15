# Local Proxy Test Server (PowerShell zero-dependency test runner)
# Mimics the exact behavior of src/index.js on http://localhost:8787

Add-Type -AssemblyName System.Web
$port = 8787
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

# Read secrets from .dev.vars
$envVars = @{}
$devVarsPath = if (Test-Path "$PSScriptRoot\.dev.vars") { "$PSScriptRoot\.dev.vars" } elseif (Test-Path ".\.dev.vars") { ".\.dev.vars" } else { "C:\Users\adity\.gemini\antigravity\scratch\Project-FlickShelft\worker\.dev.vars" }
if (Test-Path $devVarsPath) {
  Get-Content $devVarsPath | ForEach-Object {
    if ($_ -match '^\s*([^#=]+)=(.*)$') {
      $envVars[$matches[1].Trim()] = $matches[2].Trim()
    }
  }
}
$TMDB_API_KEY = $envVars['TMDB_API_KEY']
$RAWG_API_KEY = $envVars['RAWG_API_KEY']
$TWITCH_CLIENT_ID = $envVars['TWITCH_CLIENT_ID']
$TWITCH_CLIENT_SECRET = $envVars['TWITCH_CLIENT_SECRET']
Write-Host "Loaded TMDB Key: $(if ($TMDB_API_KEY) { 'OK' } else { 'MISSING' })" -ForegroundColor Gray
Write-Host "Loaded RAWG Key: $(if ($RAWG_API_KEY) { 'OK' } else { 'MISSING' })" -ForegroundColor Gray
Write-Host "Loaded Twitch ID: $(if ($TWITCH_CLIENT_ID) { 'OK' } else { 'MISSING' })" -ForegroundColor Gray
Write-Host "Loaded Twitch Secret: $(if ($TWITCH_CLIENT_SECRET) { 'OK' } else { 'MISSING' })" -ForegroundColor Gray

$global:twitchToken = ""
$global:twitchExpiry = [DateTime]::MinValue

function Get-TwitchToken {
  if ($global:twitchToken -and ([DateTime]::UtcNow -lt $global:twitchExpiry)) {
    return $global:twitchToken
  }
  $tokenUrl = "https://id.twitch.tv/oauth2/token?client_id=$([System.Uri]::EscapeDataString($TWITCH_CLIENT_ID))&client_secret=$([System.Uri]::EscapeDataString($TWITCH_CLIENT_SECRET))&grant_type=client_credentials"
  $res = Invoke-RestMethod -Uri $tokenUrl -Method Post
  $global:twitchToken = $res.access_token
  $global:twitchExpiry = [DateTime]::UtcNow.AddSeconds($res.expires_in - 60)
  return $global:twitchToken
}

$global:COMMON_ALIASES = @{
  'gta' = 'Grand Theft Auto'
  'gta 5' = 'Grand Theft Auto V'
  'gta v' = 'Grand Theft Auto V'
  'gta 4' = 'Grand Theft Auto IV'
  'gta iv' = 'Grand Theft Auto IV'
  'gta 6' = 'Grand Theft Auto VI'
  'gta vi' = 'Grand Theft Auto VI'
  'rdr' = 'Red Dead Redemption'
  'rdr 2' = 'Red Dead Redemption 2'
  'rdr2' = 'Red Dead Redemption 2'
  'botw' = 'The Legend of Zelda: Breath of the Wild'
  'totk' = 'The Legend of Zelda: Tears of the Kingdom'
  'gow' = 'God of War'
  'cod' = 'Call of Duty'
}

function Normalize-SearchQuery($raw, $useAliases = $true) {
  if (-not $raw) { return "" }
  $q = ($raw.Trim() -replace '["''`]', '') -replace '\s+', ' '
  if ($useAliases) {
    $lower = $q.ToLower()
    if ($global:COMMON_ALIASES.ContainsKey($lower)) {
      $q = $global:COMMON_ALIASES[$lower]
    }
  }
  return $q
}



Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Logger Proxy Local Test Server           " -ForegroundColor Cyan
Write-Host " Running on: http://localhost:$port/     " -ForegroundColor Green
Write-Host " Press Ctrl+C to stop                     " -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

$listener.Start()

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # CORS Headers
    $response.Headers.Add("Access-Control-Allow-Origin", "*")
    $response.Headers.Add("Access-Control-Allow-Methods", "GET, OPTIONS")
    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

    if ($request.HttpMethod -eq "OPTIONS") {
      $response.StatusCode = 204
      $response.Close()
      continue
    }

    $rawUrl = $request.RawUrl
    $uri = [System.Uri]"http://localhost:$port$rawUrl"
    $path = $uri.AbsolutePath.TrimEnd('/')
    $query = [System.Web.HttpUtility]::ParseQueryString($uri.Query)

    $jsonContent = ""
    $statusCode = 200
    $url = ""

    try {
      if ($path -eq "" -or $path -eq "/api/health") {
        $jsonContent = '{"status":"ok","service":"Logger API Proxy (Local Test)","version":"1.0.0"}'
      }
      elseif ($path -eq "/api/search/movie") {
        $q = Normalize-SearchQuery $query["query"] $false
        if (-not $q) { $statusCode = 400; $jsonContent = '{"error":"Missing query parameter"}' }
        else {
          $url = "https://api.themoviedb.org/3/search/movie?query=$([System.Uri]::EscapeDataString($q))&api_key=$($TMDB_API_KEY)"
          $res = Invoke-WebRequest -Uri $url -Headers @{ "Accept"="application/json"; "User-Agent"="Logger-Proxy/1.0" } -UseBasicParsing
          $jsonContent = $res.Content
        }
      }
      elseif ($path -eq "/api/search/tv") {
        $q = Normalize-SearchQuery $query["query"] $false
        if (-not $q) { $statusCode = 400; $jsonContent = '{"error":"Missing query parameter"}' }
        else {
          $url = "https://api.themoviedb.org/3/search/tv?query=$([System.Uri]::EscapeDataString($q))&api_key=$($TMDB_API_KEY)"
          $res = Invoke-WebRequest -Uri $url -Headers @{ "Accept"="application/json"; "User-Agent"="Logger-Proxy/1.0" } -UseBasicParsing
          $jsonContent = $res.Content
        }
      }
      elseif ($path -eq "/api/search/game") {
        $q = Normalize-SearchQuery $query["query"] $true
        $ps = if ($query["page_size"]) { [Math]::Min([int]$query["page_size"], 20) } else { 8 }
        if (-not $q) { $statusCode = 400; $jsonContent = '{"error":"Missing query parameter"}' }
        else {
          $token = Get-TwitchToken
          $apicalypse = "search `"$q`"; fields id, name, first_release_date, cover.image_id, genres.name, rating, total_rating; limit $ps;"
          $headers = @{
            "Client-ID" = $TWITCH_CLIENT_ID
            "Authorization" = "Bearer $token"
            "Accept" = "application/json"
            "User-Agent" = "Logger-Proxy/1.0"
          }
          $igdbRes = Invoke-RestMethod -Uri "https://api.igdb.com/v4/games" -Method Post -Body $apicalypse -Headers $headers
          if ((-not $igdbRes -or $igdbRes.Count -eq 0) -and $q.Length -ge 3) {
            $fallbackApicalypse = "where name ~ *`"$q`"* & cover != null; fields id, name, first_release_date, cover.image_id, genres.name, rating, total_rating; sort total_rating_count desc; limit $ps;"
            try {
              $fallbackRes = Invoke-RestMethod -Uri "https://api.igdb.com/v4/games" -Method Post -Body $fallbackApicalypse -Headers $headers
              if ($fallbackRes -and $fallbackRes.Count -gt 0) {
                $igdbRes = $fallbackRes
              }
            } catch {}
          }

          $translated = @($igdbRes | ForEach-Object {
            $rel = if ($_.first_release_date) { [DateTimeOffset]::FromUnixTimeSeconds($_.first_release_date).UtcDateTime.ToString("yyyy-MM-dd") } else { "" }
            $bg = if ($_.cover -and $_.cover.image_id) { "https://images.igdb.com/igdb/image/upload/t_cover_big/$($_.cover.image_id).jpg" } else { "" }
            $gList = @($_.genres | ForEach-Object { @{ name = $_.name } })
            $r = if ($_.total_rating) { [Math]::Round($_.total_rating / 20, 1) } elseif ($_.rating) { [Math]::Round($_.rating / 20, 1) } else { $null }
            [ordered]@{
              id = $_.id
              name = $_.name
              released = $rel
              background_image = $bg
              genres = $gList
              rating = $r
            }
          })
          $jsonContent = [ordered]@{
            results = $translated
          } | ConvertTo-Json -Depth 5
        }
      }
      elseif ($path -match '^/api/movie/(\d+)$') {
        $id = $path.Substring("/api/movie/".Length)
        $url = "https://api.themoviedb.org/3/movie/$($id)?api_key=$($TMDB_API_KEY)&append_to_response=credits"
        $res = Invoke-WebRequest -Uri $url -Headers @{ "Accept"="application/json"; "User-Agent"="Logger-Proxy/1.0" } -UseBasicParsing
        $jsonContent = $res.Content
      }
      elseif ($path -match '^/api/tv/(\d+)$') {
        $id = $path.Substring("/api/tv/".Length)
        $url = "https://api.themoviedb.org/3/tv/$($id)?api_key=$($TMDB_API_KEY)&append_to_response=credits"
        $res = Invoke-WebRequest -Uri $url -Headers @{ "Accept"="application/json"; "User-Agent"="Logger-Proxy/1.0" } -UseBasicParsing
        $jsonContent = $res.Content
      }
      elseif ($path -match '^/api/game/([a-zA-Z0-9_-]+)$') {
        $id = $path.Substring("/api/game/".Length)
        $token = Get-TwitchToken
        $apicalypse = ""
        if ($id -match '^\d+$') {
          $apicalypse = "fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; where id = $id;"
        } else {
          $cleanTitle = ($id -replace '-',' ') -replace '"',''
          $apicalypse = "search `"$cleanTitle`"; fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; limit 1;"
        }
        $headers = @{
          "Client-ID" = $TWITCH_CLIENT_ID
          "Authorization" = "Bearer $token"
          "Accept" = "application/json"
          "User-Agent" = "Logger-Proxy/1.0"
        }
        $igdbRes = Invoke-RestMethod -Uri "https://api.igdb.com/v4/games" -Method Post -Body $apicalypse -Headers $headers
        if (-not $igdbRes -or $igdbRes.Count -eq 0) {
          $statusCode = 404
          $jsonContent = '{"error":"Game not found"}'
        } else {
          $g = $igdbRes[0]
          $rel = if ($g.first_release_date) { [DateTimeOffset]::FromUnixTimeSeconds($g.first_release_date).UtcDateTime.ToString("yyyy-MM-dd") } else { "" }
          $r = if ($g.total_rating) { [Math]::Round($g.total_rating / 20, 1) } elseif ($g.rating) { [Math]::Round($g.rating / 20, 1) } else { 0 }
          $platList = @($g.platforms | ForEach-Object { @{ platform = @{ name = $_.name } } })
          $devList = @($g.involved_companies | Where-Object { $_.developer } | ForEach-Object { @{ name = $_.company.name } })
          $pubList = @($g.involved_companies | Where-Object { $_.publisher } | ForEach-Object { @{ name = $_.company.name } })
          $esrbMap = @{ 6='Rating Pending'; 7='Early Childhood'; 8='Everyone'; 9='Everyone 10+'; 10='Teen'; 11='Mature 17+'; 12='Adults Only 18+' }
          $esrbObj = $g.age_ratings | Where-Object { $_.category -eq 1 } | Select-Object -First 1
          $esrbName = if ($esrbObj -and $esrbMap.ContainsKey($esrbObj.rating)) { $esrbMap[$esrbObj.rating] } else { "-" }

          $jsonContent = [ordered]@{
            id = $g.id
            name = $g.name
            description_raw = if ($g.summary) { $g.summary } elseif ($g.storyline) { $g.storyline } else { "" }
            rating = $r
            released = $rel
            playtime = $null
            platforms = $platList
            developers = $devList
            publishers = $pubList
            esrb_rating = @{ name = $esrbName }
          } | ConvertTo-Json -Depth 5
        }
      }
      elseif ($path -eq "/api/test/igdb" -or $path -eq "/api/test/igdb/search") {
        $q = $query["query"]
        if (-not $q) { $statusCode = 400; $jsonContent = '{"error":"Missing query parameter"}' }
        else {
          $token = Get-TwitchToken
          $cleanQ = $q -replace '"',''
          $apicalypse = "search `"$cleanQ`"; fields id, name, first_release_date, cover.image_id, genres.name, rating, total_rating; limit 8;"
          $headers = @{
            "Client-ID" = $TWITCH_CLIENT_ID
            "Authorization" = "Bearer $token"
            "Accept" = "application/json"
            "User-Agent" = "Logger-Proxy/1.0"
          }
          $igdbRes = Invoke-RestMethod -Uri "https://api.igdb.com/v4/games" -Method Post -Body $apicalypse -Headers $headers
          $translated = @($igdbRes | ForEach-Object {
            $rel = if ($_.first_release_date) { [DateTimeOffset]::FromUnixTimeSeconds($_.first_release_date).UtcDateTime.ToString("yyyy-MM-dd") } else { "" }
            $bg = if ($_.cover -and $_.cover.image_id) { "https://images.igdb.com/igdb/image/upload/t_cover_big/$($_.cover.image_id).jpg" } else { "" }
            $gList = @($_.genres | ForEach-Object { @{ name = $_.name } })
            $r = if ($_.total_rating) { [Math]::Round($_.total_rating / 20, 1) } elseif ($_.rating) { [Math]::Round($_.rating / 20, 1) } else { $null }
            [ordered]@{
              id = $_.id
              name = $_.name
              released = $rel
              background_image = $bg
              genres = $gList
              rating = $r
            }
          })
          $jsonContent = [ordered]@{
            provider = "IGDB (Translated to RAWG shape)"
            count = $translated.Count
            results = $translated
          } | ConvertTo-Json -Depth 5
        }
      }
      elseif ($path -match '^/api/test/igdb/game/(\d+)$') {
        $id = $path.Substring("/api/test/igdb/game/".Length)
        $token = Get-TwitchToken
        $apicalypse = "fields id, name, first_release_date, summary, storyline, total_rating, rating, cover.image_id, genres.name, platforms.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, age_ratings.category, age_ratings.rating; where id = $id;"
        $headers = @{
          "Client-ID" = $TWITCH_CLIENT_ID
          "Authorization" = "Bearer $token"
          "Accept" = "application/json"
          "User-Agent" = "Logger-Proxy/1.0"
        }
        $igdbRes = Invoke-RestMethod -Uri "https://api.igdb.com/v4/games" -Method Post -Body $apicalypse -Headers $headers
        if (-not $igdbRes -or $igdbRes.Count -eq 0) {
          $statusCode = 404
          $jsonContent = '{"error":"Game not found on IGDB"}'
        } else {
          $g = $igdbRes[0]
          $rel = if ($g.first_release_date) { [DateTimeOffset]::FromUnixTimeSeconds($g.first_release_date).UtcDateTime.ToString("yyyy-MM-dd") } else { "" }
          $r = if ($g.total_rating) { [Math]::Round($g.total_rating / 20, 1) } elseif ($g.rating) { [Math]::Round($g.rating / 20, 1) } else { 0 }
          $pt = if ($g.time_to_beat -and $g.time_to_beat.normally) { [Math]::Round($g.time_to_beat.normally / 3600) } else { $null }
          $platList = @($g.platforms | ForEach-Object { @{ platform = @{ name = $_.name } } })
          $devList = @($g.involved_companies | Where-Object { $_.developer } | ForEach-Object { @{ name = $_.company.name } })
          $pubList = @($g.involved_companies | Where-Object { $_.publisher } | ForEach-Object { @{ name = $_.company.name } })
          $esrbMap = @{ 6='Rating Pending'; 7='Early Childhood'; 8='Everyone'; 9='Everyone 10+'; 10='Teen'; 11='Mature 17+'; 12='Adults Only 18+' }
          $esrbObj = $g.age_ratings | Where-Object { $_.category -eq 1 } | Select-Object -First 1
          $esrbName = if ($esrbObj -and $esrbMap.ContainsKey($esrbObj.rating)) { $esrbMap[$esrbObj.rating] } else { "-" }

          $jsonContent = [ordered]@{
            id = $g.id
            name = $g.name
            description_raw = if ($g.summary) { $g.summary } elseif ($g.storyline) { $g.storyline } else { "" }
            rating = $r
            released = $rel
            playtime = $pt
            platforms = $platList
            developers = $devList
            publishers = $pubList
            esrb_rating = @{ name = $esrbName }
          } | ConvertTo-Json -Depth 5
        }
      }
      else {
        $statusCode = 404
        $jsonContent = "{`"error`":`"Endpoint not found: $path`"}"
      }
    }
    catch {
      $statusCode = 500
      $jsonContent = "{`"error`":`"$($_.Exception.Message)`"}"
    }

    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonContent)
    $response.ContentLength64 = $buffer.Length
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.Close()
    Write-Host "[$($request.HttpMethod)] $rawUrl (Upstream: $url) -> $statusCode" -ForegroundColor Gray
  }
}
finally {
  $listener.Stop()
  $listener.Close()
}
