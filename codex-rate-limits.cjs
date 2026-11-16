const { spawn } = require('node:child_process');

// Read Codex's account usage without starting a model turn.
function readCodexRateLimits(timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    const child = spawn('codex', ['app-server', '--listen', 'stdio://'], { stdio: ['pipe', 'pipe', 'ignore'] });
    let buffer = '', settled = false;
    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.kill();
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => finish(new Error('Codex quota read timed out')), timeoutMs);
    child.on('error', error => finish(error));
    child.on('exit', code => finish(new Error(`Codex app-server exited ${code}`)));
    const send = message => child.stdin.write(JSON.stringify(message) + '\n');
    child.stdout.on('data', chunk => {
      buffer += chunk.toString();
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
        let message; try { message = JSON.parse(line); } catch { continue; }
        if (message.id === 1) {
          if (message.error) return finish(new Error(message.error.message || 'Codex initialize failed'));
          send({ method: 'initialized' });
          send({ id: 2, method: 'account/rateLimits/read', params: { excludeResetCreditDetails: true } });
        } else if (message.id === 2) {
          if (message.error) return finish(new Error(message.error.message || 'Codex quota read failed'));
          finish(null, message.result);
        }
      }
    });
    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'atelierx-quota', title: 'AtelierX quota', version: '1.0.0' } } });
  });
}
module.exports = { readCodexRateLimits };
