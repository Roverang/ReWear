# Creates backend.env at the repo root with freshly generated local secrets.
# Never overwrites an existing backend.env and never prints the generated values.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/make-local-env.ps1

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $repoRoot 'backend.env'

if (Test-Path $envFile) {
    Write-Host 'backend.env already exists - left untouched'
    exit 0
}

$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

# Alphanumeric only, so the value is safe in docker env files, .properties and JDBC.
function New-RandomPassword([int]$length) {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    $sb = New-Object System.Text.StringBuilder
    $buf = New-Object byte[] 1
    while ($sb.Length -lt $length) {
        $rng.GetBytes($buf)
        # 248 = 62 * 4: rejecting larger bytes avoids modulo bias
        if ($buf[0] -lt 248) { [void]$sb.Append($chars[$buf[0] % 62]) }
    }
    return $sb.ToString()
}

$dbPassword = New-RandomPassword 24

$jwtBytes = New-Object byte[] 64
$rng.GetBytes($jwtBytes)
$jwtSecret = [Convert]::ToBase64String($jwtBytes)

$lines = @(
    'POSTGRES_DB=rewear',
    'POSTGRES_USER=rewear',
    "POSTGRES_PASSWORD=$dbPassword",
    'DB_URL=jdbc:postgresql://localhost:5432/rewear',
    'DB_USERNAME=rewear',
    "DB_PASSWORD=$dbPassword",
    "JWT_SECRET=$jwtSecret",
    'FRONTEND_ORIGIN=http://localhost:8080'
)

# UTF-8 without BOM and LF line endings, so docker compose and Spring read the first key correctly.
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($envFile, (($lines -join "`n") + "`n"), $utf8NoBom)

Write-Host 'backend.env created'
