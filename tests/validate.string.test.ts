import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('string ok', () => {
    expect(validate('a', { type: 'string' }).valid).toBe(true);
  });

  it('string with pattern ok', () => {
    expect(validate('abc', { type: 'string', pattern: '^[a-z]+$' }).valid).toBe(true);
  });

  it('string with pattern fail', () => {
    expect(validate('abc123', { type: 'string', pattern: '^[a-z]+$' }).valid).toBe(false);
  });

  it('string error message', () => {
    const result = validate('abc123', { type: 'string', pattern: '^[a-z]+$' });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must match pattern ^[a-z]+$' }]);
  });
});