import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('enum ok', () => {
    expect(validate('red', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(true);
    expect(validate('green', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(true);
    expect(validate('blue', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(true);
  });

  it('enum fail', () => {
    expect(validate('yellow', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(false);
    expect(validate('RED', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(false);
    expect(validate('', { type: 'enum', values: ['red', 'green', 'blue'] }).valid).toBe(false);
  });

  it('enum error message', () => {
    const result = validate('yellow', { type: 'enum', values: ['red', 'green', 'blue'] });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'invalid enum, allowed values are: red, green, blue' }]);
  });
});