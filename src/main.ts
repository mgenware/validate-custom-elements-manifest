#!/usr/bin/env node
import { promises as fsPromises } from 'fs';
import Ajv from 'ajv';
import np from 'path';
import { fileURLToPath } from 'url';

const dirname = np.dirname(fileURLToPath(import.meta.url));
const schemaFile = np.resolve(dirname, '../node_modules/custom-elements-manifest/schema.json');

async function readSchema() {
  try {
    const jsonText = await fsPromises.readFile(schemaFile, 'utf8');
    return JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`Error reading schema file at "${schemaFile}": ${(err as Error).message}`);
  }
}

async function readManifest(file: string) {
  try {
    const jsonText = await fsPromises.readFile(file, 'utf8');
    return JSON.parse(jsonText);
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
    const validate = ajv.compile(await readSchema());
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
