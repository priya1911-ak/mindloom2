$dir = "c:\Users\Priya\OneDrive\Desktop\web\mindlift"

# Move files to root
if (Test-Path "$dir\css\style.css") { Move-Item -Path "$dir\css\style.css" -Destination "$dir\style.css" -Force }
if (Test-Path "$dir\js\script.js") { Move-Item -Path "$dir\js\script.js" -Destination "$dir\script.js" -Force }

# Delete empty folders
if (Test-Path "$dir\css") { Remove-Item -Path "$dir\css" -Recurse -Force }
if (Test-Path "$dir\js") { Remove-Item -Path "$dir\js" -Recurse -Force }

# Update HTML files
$htmlFiles = Get-ChildItem -Path $dir -Filter *.html
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'href="css/style.css"', 'href="style.css"' -replace 'src="js/script.js"', 'src="script.js"'
    [System.IO.File]::WriteAllText($file.FullName, $newContent)
}
Write-Host "Flattened successfully!"
