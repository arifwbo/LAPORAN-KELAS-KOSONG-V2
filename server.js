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

// Listen on 0.0.0.0 to allow external access (untuk port forwarding)
app.listen(PORT, '0.0.0.0', () => {
  const localUrl = `http://localhost:${PORT}`;
  const networkUrl = `http://0.0.0.0:${PORT}`;
  
  console.log('\n' + '='.repeat(70));
  console.log('🚀 SiswaConnect Server Started!');
  console.log(`📡 Server berjalan di: ${localUrl}`);
  console.log(`🌐 Network Access: ${networkUrl}`);
  console.log('\n💡 Informasi:');
  console.log(`   ✓ Port: ${PORT}`);
  console.log(`   ✓ Local: ${localUrl}`);
  console.log(`   ✓ Network: Accessible from external IP (port forwarding ready)`);
  console.log(`   ✓ Tekan Ctrl+C untuk stop server`);
  console.log('='.repeat(70) + '\n');
  
  // Auto open browser
  if (process.platform === 'win32') {
    exec(`start ${localUrl}`);
  } else if (process.platform === 'darwin') {
    exec(`open ${localUrl}`);
  } else {
    exec(`xdg-open ${localUrl}`);
  }
});
