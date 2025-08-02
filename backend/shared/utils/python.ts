import { spawnSync } from 'child_process';

export function runPython(code: string, args: string[] = []) {
  const result = spawnSync('python', ['-c', code, ...args], {
    encoding: 'utf-8',
    env: { ...process.env, PYTHONPATH: 'src' },
  });
  if (result.error) {
    throw result.error;
  }
  if (result.stderr) {
    const err = result.stderr.toString();
    if (err.trim()) {
      throw new Error(err);
    }
  }
  const stdout = result.stdout.toString().trim();
  return stdout ? JSON.parse(stdout) : null;
}
