import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('any ok', () => {
    expect(validate('anything', { type: 'any' }).valid).toBe(true);
    expect(validate('123', { type: 'any' }).valid).toBe(true);
    expect(validate('true', { type: 'any' }).valid).toBe(true);
    expect(validate('', { type: 'any' }).valid).toBe(true);
    expect(validate('[1, 2, 3]', { type: 'any' }).valid).toBe(true);
    expect(validate('{"key": "value"}', { type: 'any' }).valid).toBe(true);
  });
});