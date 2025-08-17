[CmdletBinding()]
param(
  [switch]$Verbose
)

Write-Host "Test script works" -ForegroundColor Green
if ($Verbose) { Write-Host "Verbose mode enabled" -ForegroundColor Cyan }
