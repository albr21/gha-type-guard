import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('integer ok', () => {
    expect(validate('1', { type: 'integer' }).valid).toBe(true);
    expect(validate('-5', { type: 'integer' }).valid).toBe(true);
    expect(validate('0', { type: 'integer' }).valid).toBe(true);
  });

  it('integer fail', () => {
    expect(validate('1.2', { type: 'integer' }).valid).toBe(false);
    expect(validate('true', { type: 'integer' }).valid).toBe(false);
  });

  it('integer error message', () => {
    const result = validate('true', { type: 'integer' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must be integer' }]);
  });
});