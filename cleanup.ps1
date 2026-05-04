
Write-Host "Starting Cleanup to free up disk space..." -ForegroundColor Cyan

# 1. Clear User Temp
Write-Host "Cleaning User Temp..."
$userTemp = $env:TEMP
Get-ChildItem -Path $userTemp -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 2. Clear Windows Temp
Write-Host "Cleaning Windows Temp..."
$winTemp = "C:\Windows\Temp"
Get-ChildItem -Path $winTemp -Recurse -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 3. Empty Recycle Bin
Write-Host "Emptying Recycle Bin..."
Clear-RecycleBin -Confirm:$false -ErrorAction SilentlyContinue

# 4. Clear npm cache (if npm exists)
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "Cleaning npm cache..."
    cmd /c "npm cache clean --force"
}

# 5. Check final space
$drive = Get-PSDrive C
$freeGB = [Math]::Round($drive.Free / 1GB, 2)
Write-Host "`nCleanup Complete! Free space: $freeGB GB" -ForegroundColor Green
