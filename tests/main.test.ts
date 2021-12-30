import * as assert from 'assert';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as np from 'path';

const execAsync = promisify(exec);

async function t(file: string | null, error: string | null): Promise<void> {
  let actualValid: boolean;
  try {
    let cmd = 'node "../../dist/main.js"';
    if (file) {
      cmd += ` ${file}.json`;
    }
    const { stdout, stderr } = await execAsync(cmd, { cwd: np.resolve('tests', 'manifest') });
    if (stdout) {
      console.error(stdout);
    }
    if (stderr) {
      console.error(stderr);
    }
    actualValid = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    actualValid = false;
    assert.ok(error);
    assert.ok(err.stderr);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    assert.ok(err.stderr.includes(error));
  }
  assert.strictEqual(actualValid, !error);
}

it('Success', async () => {
  await t('success', null);
});

it('Error', async () => {
  await t('err', "must have required property 'kind'");
});

it('Default args', async () => {
  await t('custom-elements', null);
});
