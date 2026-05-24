import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('boolean ok', () => {
    expect(validate('true', { type: 'boolean' }).valid).toBe(true);
    expect(validate('false', { type: 'boolean' }).valid).toBe(true);
  });

  it('boolean fail', () => {
    expect(validate('1', { type: 'boolean' }).valid).toBe(false);
    expect(validate('yes', { type: 'boolean' }).valid).toBe(false);
    expect(validate('no', { type: 'boolean' }).valid).toBe(false);
    expect(validate("True", { type: 'boolean' }).valid).toBe(false);
    expect(validate("False", { type: 'boolean' }).valid).toBe(false);
  });

  it('boolean error message', () => {
    const result = validate('yes', { type: 'boolean' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must be boolean' }]);
  });
});