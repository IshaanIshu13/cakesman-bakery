$result = (Invoke-WebRequest -Uri 'http://localhost:5001/api/products?category=flavor-station' -UseBasicParsing).Content | ConvertFrom-Json

Write-Host "✅ Flavor Station Products Successfully Reseeded!" -ForegroundColor Green
Write-Host ""

$result | ForEach-Object {
    Write-Host "  • $($_.name) - $($_.subcategory) - ₹$($_.basePrice)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "Total Products: $($result.Count)"

$grouped = $result | Group-Object -Property subcategory
Write-Host ""
$grouped | ForEach-Object {
    $line = "  " + $_.Name + ": " + $_.Count + " products"
    Write-Host $line
}
