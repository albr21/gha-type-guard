import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('float ok', () => {
    expect(validate('1.2', { type: 'float' }).valid).toBe(true);
    expect(validate('-5.6', { type: 'float' }).valid).toBe(true);
    expect(validate('0.0', { type: 'float' }).valid).toBe(true);
  });

  it('float fail', () => {
    expect(validate('1', { type: 'float' }).valid).toBe(false);
    expect(validate('true', { type: 'float' }).valid).toBe(false);
  });

  it('float error message', () => {
    const result = validate('true', { type: 'float' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must be float' }]);
  });
});