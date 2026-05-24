import * as core from '@actions/core';
import { validate } from './validate.js';
import type { Schema } from './schema.js';
import { toSchema } from './schema.js';
import { escapeSpecialCharacters } from './utils.js';

const logPrefix = '[gha-type-guard]';

type InputItem =
  | { value: unknown; type: string }
  | { value: unknown; schema: Schema };

export async function run() {
  try {
    const raw = core.getInput('payload', { required: true });
    const escaped = escapeSpecialCharacters(raw);
    const parsed: InputItem[] = JSON.parse(escaped);

    const mode = (core.getInput('fail-fast') === 'true' ? 'fast' : 'collect') as 'fast' | 'collect';
    let allErrors: any[] = [];

    for (let i = 0; i < parsed.length; i++) {
      const schema = toSchema(parsed[i]);

      const res = validate(
        String(parsed[i].value),
        schema,
        `item[${i}]`,
        mode,
      );

      if (!res.valid && mode === 'collect') {
        allErrors.push(...res.errors);
      }

      if (!res.valid && mode === 'fast') {
        throw new Error(`${res.errors[0].path}: ${res.errors[0].message}`);
      }
    }

    if (allErrors.length > 0) {
      for (const e of allErrors) {
        core.error(`${logPrefix} ${e.path}: ${e.message}`);
      }
      core.setFailed(`${logPrefix} Validation failed`);
      return;
    }

    core.info(`${logPrefix} All items validated successfully`);
  } catch (e) {
    if (e instanceof Error) {
      core.error(`${logPrefix} ${e.message}`);
    } else {
      core.error(`${logPrefix} ${String(e)}`);
    }
    core.setFailed(`${logPrefix} Validation failed`);
  }
}

run();
