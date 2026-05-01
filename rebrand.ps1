$files = Get-ChildItem -Path "c:\Users\Priya\OneDrive\Desktop\web\mindlift" -Recurse -Include *.html, *.css, *.js
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $newContent = $content -replace 'MindLift', 'MindLoom' -replace 'mindlift', 'mindloom'
    [System.IO.File]::WriteAllText($file.FullName, $newContent)
}
Write-Host "Rebranding to MindLoom completed successfully!"
