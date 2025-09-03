# GYMovoo Project Structure Initialization Script
# Creates the folder structure for GYMovoo project
# Updated: 2025-09-03

[CmdletBinding()]
param(
  [switch]$DryRun
)

function Write-Info($msg) { Write-Host $msg -ForegroundColor Cyan }
function Write-Ok($msg) { Write-Host $msg -ForegroundColor Green }

if ($DryRun) { Write-Info "DryRun mode - no changes will be made" }

Write-Info "Starting project structure initialization..."
# Essential project folders
$folders = @(
  "src/screens/welcome/components",
  "src/screens/auth/components", 
  "src/screens/questionnaire/components",
  "src/screens/workout/components",
  "src/screens/exercises",
  "src/components/common",
  "src/components/forms",
  "src/components/workout",
  "src/components/ui",
  "src/data/exercises",
  "src/data/equipment",
  "src/hooks",
  "src/stores", 
  "src/services",
  "src/types",
  "src/utils",
  "src/constants",
  "src/styles",
  "src/navigation",
  "assets/equipment",
  "assets/exercises",
  "docs",
  "scripts"
)

Write-Info "Creating missing directories..."

$createdFolders = 0
foreach ($folder in $folders) {
  if (!(Test-Path $folder)) {
    if ($DryRun) {
      Write-Host "[DRY] Would create: $folder" -ForegroundColor Yellow
    } else {
      New-Item -ItemType Directory -Force -Path $folder | Out-Null
      $createdFolders++
      Write-Host "Created: $folder" -ForegroundColor Green
    }
  }
}

Write-Ok "Structure initialization complete"
Write-Info "Created $createdFolders new folders"
if ($DryRun) { Write-Info "No actual changes were made (DryRun mode)" }
