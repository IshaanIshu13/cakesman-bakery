const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/products?category=flavor-station',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const products = JSON.parse(data);
    
    console.log('\n✅ Flavor Station Products Successfully Reseeded!\n');
    
    products.forEach(product => {
      console.log(`  • ${product.name} - ${product.subcategory} - ₹${product.basePrice}`);
    });
    
    console.log(`\nSummary:`);
    console.log(`Total Products: ${products.length}`);
    
    const grouped = {};
    products.forEach(p => {
      if (!grouped[p.subcategory]) grouped[p.subcategory] = 0;
      grouped[p.subcategory]++;
    });
    
    console.log('');
    Object.entries(grouped).forEach(([subcategory, count]) => {
      console.log(`  ${subcategory}: ${count} products`);
    });
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
