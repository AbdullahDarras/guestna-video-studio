# Windows bootstrap (PowerShell). NOT TESTED by the author on Windows yet: report any problem.
# Run:  powershell -ExecutionPolicy Bypass -File .\setup.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$needNode = $true
if (Get-Command node -ErrorAction SilentlyContinue) {
  $major = [int](node -p "process.versions.node.split('.')[0]")
  if ($major -ge 20) { $needNode = $false }
}
if ($needNode) {
  Write-Host "Node 20+ not found. Installing Node LTS with winget..."
  winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
  Write-Host "Node installed. Close this window, open a NEW PowerShell, and run this script again."
  exit 0
}
node scripts/setup.mjs
