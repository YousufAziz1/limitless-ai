const { spawn } = require('child_process');
const path = require('path');
const mainExe = path.resolve('C:\\Users\\USER\\OneDrive\\Desktop\\new agent\\noor-ai\\backend\\dist\\main.exe');
console.log('Spawning:', mainExe);

const proc = spawn(mainExe, [], {
  cwd: path.dirname(mainExe),
  stdio: ['ignore', 'pipe', 'pipe'],
  windowsHide: true,
  shell: true
});

proc.stdout.on('data', d => console.log('STDOUT:', d.toString()));
proc.stderr.on('data', d => console.log('STDERR:', d.toString()));
proc.on('error', e => console.error('ERROR:', e));
proc.on('close', c => console.log('CLOSE:', c));

setTimeout(() => proc.kill(), 5000);
