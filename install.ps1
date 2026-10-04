# One-command installer for teammates WITHOUT a GitHub account (Windows PowerShell). Not tested on Windows yet.
#   $T="<access-code>"; iwr -UseBasicParsing -Headers @{Authorization="token $T"} https://raw.githubusercontent.com/AbdullahDarras/guestna-video-studio/main/install.ps1 | iex
$ErrorActionPreference = "Stop"
$token = if ($env:GUESTNA_TOKEN) { $env:GUESTNA_TOKEN } else { $T }
$home_dir = if ($env:GUESTNA_HOME) { $env:GUESTNA_HOME } else { Join-Path $HOME "GuestNa" }
$studio = if ($env:GUESTNA_STUDIO_URL) { $env:GUESTNA_STUDIO_URL } else { "https://github.com/AbdullahDarras/guestna-video-studio.git" }

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  winget install --id Git.Git -e --source winget
  Write-Host "Git was installed. Close this window, open a new PowerShell and run the command again."
  return
}
if ($token) {
  $basic = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("x-access-token:$token"))
  git config --global "http.https://github.com/AbdullahDarras/.extraHeader" "Authorization: Basic $basic"
  Write-Host "Access code saved for the GuestNa repos."
}
$env:GIT_TERMINAL_PROMPT = "0"
New-Item -ItemType Directory -Force -Path $home_dir | Out-Null
Set-Location $home_dir
if (Test-Path "guestna-video-studio/.git") {
  git -C guestna-video-studio pull --ff-only
} else {
  git clone $studio guestna-video-studio
  if ($LASTEXITCODE -ne 0) { Write-Host "Could not download the studio. The access code may be wrong or expired."; return }
}
Set-Location guestna-video-studio
powershell -ExecutionPolicy Bypass -File ./setup.ps1
Write-Host "Done. Open this folder in Claude Code: $home_dir\guestna-video-studio"
