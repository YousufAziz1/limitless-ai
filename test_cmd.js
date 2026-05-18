const { spawn } = require('child_process');
const fs = require('fs');

fs.writeFileSync('testcmd.cmd', 'echo hello');
try {
  const p = spawn('testcmd.cmd', [], {shell: false});
  p.on('error', console.log);
} catch (e) {
  console.log('caught:', e.code);
}
