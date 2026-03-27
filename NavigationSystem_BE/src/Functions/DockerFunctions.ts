const { spawn } = require('child_process');

export const runCmd = async (cmd: string, args: string[], opts = {}) => {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('error', reject);
    p.on('exit', (code: number, sig: string) => {
      if (code === 0) resolve({ code, sig });
      else reject(new Error(`${cmd} ${args.join(' ')} exited ${code || sig}`));
    });
  });
}

export const stopContainer = async (name: string, timeoutMs = 10000) => {
  try {
    await runCmd('docker', ['stop', '--time', String(Math.ceil(timeoutMs/1000)), name]);
  } catch (err) {
    // fallback to kill if stop failed or timed out
    await runCmd('docker', ['kill', name]);
  }
}

export const removeContainer = async (name: string, timeoutMs = 10000) => {
  await runCmd('docker', ['rm', name]);
}

export const waitForExit = async (name: string, pollInterval = 500) => {
  // docker wait blocks until exit; use it for reliability
  await runCmd('docker', ['wait', name]);
}

export const isContainerRunning = async (name: string, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    const args = ['ps', '-q', '-f', `name=${name}`];
    const proc = spawn('docker', args);

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('timeout'));
    }, timeoutMs);

    proc.stdout.on('data', (chunk: any) => out += chunk.toString());
    proc.stderr.on('data', (chunk: any) => err += chunk.toString());

    proc.on('error', (e: Error) => {
      clearTimeout(timer);
      reject(e);
    });

    proc.on('close', (code: number) => {
      clearTimeout(timer);
      if (code !== 0 && err) return reject(new Error(err.trim()));
      const id = out.trim();
      resolve(id.length > 0);
    });
  });
}