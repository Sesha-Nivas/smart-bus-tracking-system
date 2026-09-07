const net = require('net');
const { spawn } = require('child_process');

function findAvailablePort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      server.close();
      resolve(findAvailablePort(port + 1));
    });

    server.once('listening', () => {
      server.close(() => resolve(port));
    });

    server.listen(port, '127.0.0.1');
  });
}

findAvailablePort(Number(process.env.PORT) || 3000)
  .then((port) => {
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const child = spawn(command, ['exec', 'react-scripts', 'start'], {
      env: { ...process.env, PORT: String(port) },
      stdio: 'inherit',
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code ?? 0);
      }
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
