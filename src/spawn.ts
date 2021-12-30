import { spawn } from 'child_process';

export default async function spawnMain(cmd: string, args: ReadonlyArray<string>): Promise<void> {
  if (!cmd || !cmd.length) {
    throw new Error('Argument "cmd" cannot be empty');
  }

  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, {
      shell: true,
      stdio: 'inherit',
    });
    process.on('close', (code) => {
      if (code) {
        reject(new Error(`Command failed with code ${code} (${cmd})`));
      } else {
        resolve();
      }
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}
