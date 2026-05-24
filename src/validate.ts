import type { Schema } from './schema.js';
import { unescapeSpecialCharacters } from './utils.js';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export type Mode = 'fast' | 'collect';

export function validate(
  value: string,
  schema: Schema,
  path = 'value',
  mode: Mode = 'fast'
): ValidationResult {
  const errors: ValidationError[] = [];

  const add = (msg: string, p: string) => errors.push({ message: msg, path: p });

  const shouldStop = () => mode === 'fast' && errors.length > 0;

  const checkString = (value: string, path: string, pattern?: string): boolean => {
    if (pattern && !new RegExp(pattern).test(value)) add('must match pattern ' + pattern, path);
    return true;
  };

  const checkBoolean = (value: string, path: string): boolean => {
    if (value !== 'true' && value !== 'false') {
      add('must be boolean', path);
      return false;
    }
    return true;
  };

  const checkInteger = (value: string, path: string): boolean => {
    if (!/^-?\d+$/.test(value as string)) {
        add('must be integer', path);
        return false;
    }
    return true;
  };

  const checkFloat = (value: string, path: string): boolean => {
    if (!/^-?\d+\.\d+$/.test(value as string)) {
      add('must be float', path);
      return false;
    }
    return true;
  };

  const checkNumber = (value: string, path: string): boolean => {
    if (!/^-?\d+(\.\d+)?$/.test(value as string)) {
        add('must be number', path);
        return false;
    }
    return true;
  };

  const checkAny = (_value: string): boolean => true;

  const checkArray = (value: string, itemSchema: Schema, path: string): boolean => {
    let arr: unknown;
    try {
      arr = JSON.parse(value);
    } catch {
      add('must be array', path);
      return false;
    }
    if (!Array.isArray(arr)) {
      add('must be array', path);
      return false;
    }
    for (let i = 0; i < arr.length; i++) {
      run(String(arr[i]), itemSchema, `${path}[${i}]`);
    }
    return true;
  };

  const checkEnum = (value: string, values: unknown[], path: string): boolean => {
    if (!values.includes(value)) {
      add('invalid enum, allowed values are: ' + values.join(', '), path);
      return false;
    }
    return true;
  };

  const checkObject = (value: string, properties: Record<string, Schema>, required: string[] | undefined, path: string): boolean => {
    let obj: unknown;
    const unescaped = unescapeSpecialCharacters(value);

    try {
      obj = JSON.parse(unescaped);
    } catch {
      add('must be object', path);
      return false;
    }
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      add('must be object', path);
      return false;
    }
    const record = obj as Record<string, unknown>;
    if (required) {
      for (const r of required) {
        if (!(r in record)) add(`${r} is required`, `${path}.${r}`);
      }
    }
    for (const key of Object.keys(properties)) {
      run(JSON.stringify(record[key]), properties[key], `${path}.${key}`);
    }
    return true;
  };

  const checkUnion = (value: string, anyOf: Schema[], path: string): boolean => {
    const snapshot = errors.length;
    for (const candidate of anyOf) {
      const before = errors.length;
      run(value, candidate, path);
      if (errors.length === before) {
        errors.splice(snapshot); // rollback
        return true;
      }
      errors.splice(before); // rollback tentative errors
    }
    add('no union match', path);
    return false;
  };

  function run(v: string, s: Schema, p: string): void {
    if (shouldStop()) return;

    switch (s.type) {
      case 'string':
        checkString(v, p, s.pattern)
        return;

      case 'boolean':
        checkBoolean(v, p);
        return;

      case 'integer':
        checkInteger(v, p);
        return;

      case 'float':
        checkFloat(v, p);
        return;

      case 'number':
        checkNumber(v, p);
        return;

      case 'any':
        checkAny(v);
        return;

      case 'array':
        checkArray(v, s.items, p);
        return;

      case 'enum':
        checkEnum(v, s.values, p);
        return;

      case 'object':
        checkObject(v, s.properties, s.required, p);
        return;

      case 'union':
        checkUnion(v, s.anyOf, p);
        return;
    }
  }

  run(value, schema, path);

  return { valid: errors.length === 0, errors };
}