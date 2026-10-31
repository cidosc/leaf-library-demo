param([Parameter(Mandatory=$true)][string]$PgBin)
$ErrorActionPreference = 'Stop'
$demoRoot = Split-Path $PSScriptRoot -Parent
$runtimeRoot = Join-Path $demoRoot '.runtime'
$clusterRoot = Join-Path $runtimeRoot 'pgdata'
$environmentFile = Join-Path $demoRoot '.env.local'
if (!(Test-Path -LiteralPath (Join-Path $PgBin 'initdb.exe'))) { throw 'Use an existing PostgreSQL 18 bin directory.' }
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
if (!(Test-Path -LiteralPath (Join-Path $clusterRoot 'PG_VERSION'))) {
  if (Test-Path -LiteralPath $environmentFile) { throw 'Existing environment file: configure the demo cluster explicitly.' }
  $demoPassword = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)).ToLowerInvariant()
  $passwordFile = Join-Path $runtimeRoot 'init-password'
  [IO.File]::WriteAllText($passwordFile,$demoPassword)
  & (Join-Path $PgBin 'initdb.exe') -D $clusterRoot -U leaf_demo -E UTF8 --locale=C --auth=scram-sha-256 "--pwfile=$passwordFile"
  if ($LASTEXITCODE -ne 0) { throw 'Demo cluster initialization failed.' }
  Remove-Item -LiteralPath $passwordFile
  Add-Content -LiteralPath (Join-Path $clusterRoot 'postgresql.conf') -Value "`nlisten_addresses='127.0.0.1'`nport=55439`nshared_buffers='64MB'`nmax_connections=30"
  [IO.File]::WriteAllText($environmentFile,"DATABASE_URL=postgresql://leaf_demo:$demoPassword@127.0.0.1:55439/leaf_demo`nNEXT_PUBLIC_SITE_URL=http://127.0.0.1:3100`n")
}
& (Join-Path $PgBin 'pg_isready.exe') -h 127.0.0.1 -p 55439 -q
if ($LASTEXITCODE -ne 0) {
  $startArgs = @('-D',('"'+$clusterRoot+'"'),'-l',('"'+(Join-Path $runtimeRoot 'postgres.log')+'"'),'-w','start')
  $pgProcess = Start-Process -FilePath (Join-Path $PgBin 'pg_ctl.exe') -ArgumentList $startArgs -WindowStyle Hidden -PassThru
  if (!$pgProcess.WaitForExit(30000) -or $pgProcess.ExitCode -ne 0) { throw 'Demo PostgreSQL did not start; see the local runtime log.' }
}
$line = Get-Content -LiteralPath $environmentFile | Where-Object { $_ -like 'DATABASE_URL=*' } | Select-Object -First 1
$localConnection = [Uri]$line.Substring(13)
$env:PGPASSWORD = $localConnection.UserInfo.Split(':',2)[1]
try {
  $present = & (Join-Path $PgBin 'psql.exe') -h 127.0.0.1 -p 55439 -U leaf_demo -d postgres -w -Atc "SELECT 1 FROM pg_database WHERE datname='leaf_demo'"
  if ($present -ne '1') { & (Join-Path $PgBin 'createdb.exe') -h 127.0.0.1 -p 55439 -U leaf_demo -w leaf_demo; if ($LASTEXITCODE -ne 0) {throw 'Creating demo database failed.'} }
} finally { Remove-Item Env:PGPASSWORD }
Write-Output 'Independent demo database ready at 127.0.0.1:55439. Pure local demo only.'
