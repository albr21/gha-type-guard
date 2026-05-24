import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('number ok', () => {
    expect(validate('1', { type: 'number' }).valid).toBe(true);
    expect(validate('-5', { type: 'number' }).valid).toBe(true);
    expect(validate('0', { type: 'number' }).valid).toBe(true);
    expect(validate('1.2', { type: 'number' }).valid).toBe(true);
    expect(validate('-5.6', { type: 'number' }).valid).toBe(true);
    expect(validate('0.0', { type: 'number' }).valid).toBe(true);
    expect(validate('1.2', { type: 'number' }).valid).toBe(true);
    expect(validate('-5.6', { type: 'number' }).valid).toBe(true);
    expect(validate('0.0', { type: 'number' }).valid).toBe(true);
  });

  it('number fail', () => {
    expect(validate('abc', { type: 'number' }).valid).toBe(false);
    expect(validate('true', { type: 'number' }).valid).toBe(false);
    expect(validate('NaN', { type: 'number' }).valid).toBe(false);
  });

  it('number error message', () => {
    const result = validate('true', { type: 'number' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must be number' }]);
  });
});