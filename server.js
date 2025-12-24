const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 1991; // Port custom seperti Dapodik

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('\n' + '='.repeat(70));
  console.log('🚀 SiswaConnect Server Started!');
  console.log(`📡 Server berjalan di: ${url}`);
  console.log(`🌐 Buka browser dan akses: ${url}`);
  console.log('\n💡 Informasi:');
  console.log(`   ✓ Port: ${PORT}`);
  console.log(`   ✓ Tekan Ctrl+C untuk stop server`);
  console.log('='.repeat(70) + '\n');
  
  // Auto open browser
  if (process.platform === 'win32') {
    exec(`start ${url}`);
  } else if (process.platform === 'darwin') {
    exec(`open ${url}`);
  } else {
    exec(`xdg-open ${url}`);
  }
});
