const { spawn } = require('child_process');
const fs = require('fs');

// Try spawning a non-executable file
fs.writeFileSync('test.txt', 'hello');
const p1 = spawn('test.txt', [], {shell: false});
p1.on('error', e => console.log('p1 error:', e.code));

// Try spawning with shell: true but bad command
const p2 = spawn('test.txt', [], {shell: true});
p2.on('error', e => console.log('p2 error:', e.code));

// Try spawning a bad exe
fs.writeFileSync('bad.exe', 'not an exe');
const p3 = spawn('./bad.exe', [], {shell: false});
p3.on('error', e => console.log('p3 error:', e.code));

const p4 = spawn('./bad.exe', [], {shell: true});
p4.on('error', e => console.log('p4 error:', e.code));
