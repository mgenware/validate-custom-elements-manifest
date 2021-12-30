#!/usr/bin/env node
import { promises as fsPromises } from 'fs';
import Ajv from 'ajv';
import schema from 'custom-elements-manifest-esm-obj';

async function readManifest(file: string) {
  try {
    const jsonText = await fsPromises.readFile(file, 'utf8');
    return JSON.parse(jsonText) as unknown;
  } catch (err) {
    throw new Error(`Error reading file "${file}": ${(err as Error).message}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const args = process.argv.slice(2);
    const inputFile = args[0] || 'custom-elements.json';
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(await readManifest(inputFile))) {
      console.error(`Schema validation of file "${inputFile}" failed`);
      console.error(validate.errors);
      process.exit(1);
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
})();
