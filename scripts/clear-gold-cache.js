// Clear gold price cache
// Run this after updating gold prices to force refresh

const fs = require('fs');
const path = require('path');

const cacheDir = path.join(__dirname, '../.cache');

console.log('🧹 Clearing gold price cache...');

try {
  if (fs.existsSync(cacheDir)) {
    const files = fs.readdirSync(cacheDir);
    
    files.forEach(file => {
      if (file.includes('gold')) {
        const filePath = path.join(cacheDir, file);
        fs.unlinkSync(filePath);
        console.log(`✓ Deleted: ${file}`);
      }
    });
    
    console.log('✅ Gold cache cleared successfully!');
    console.log('📊 New price will be: $4,865.26 (Jan 21, 2026 market price)');
  } else {
    console.log('ℹ️  No cache directory found');
  }
} catch (error) {
  console.error('❌ Error clearing cache:', error.message);
}
