import { spawn } from 'child_process';

/**
 * Execute a Python module asynchronously via ``python -m`` and resolve with
 * parsed JSON output. Stdout and stderr are captured incrementally. The
 * returned promise is rejected if the process exits with a non-zero code or if
 * stderr receives content. A timeout (ms) may be provided to kill the process
 * if it hangs.
 */
export function runPython(
  module: string,
  args: string[] = [],
  { timeoutMs = 10000 }: { timeoutMs?: number } = {},
): Promise<any> {
  return new Promise((resolve, reject) => {
    const proc = spawn('python', ['-m', module, ...args], {
      env: { ...process.env, PYTHONPATH: 'src' },
    });

    let stdout = '';
    let stderr = '';

    const timer = timeoutMs
      ? setTimeout(() => {
          proc.kill();
          reject(new Error('Python process timed out'));
        }, timeoutMs)
      : null;

    proc.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('error', (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });

    proc.on('close', (code) => {
      if (timer) clearTimeout(timer);
      if (code !== 0) {
        return reject(new Error(stderr || `Python exited with code ${code}`));
      }
      if (stderr.trim()) {
        return reject(new Error(stderr));
      }
      try {
        const out = stdout.trim();
        resolve(out ? JSON.parse(out) : null);
      } catch (err) {
        reject(err);
      }
    });
  });
}
