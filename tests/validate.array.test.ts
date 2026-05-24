import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('array ok', () => {
    expect(validate('["a", "b", "c"]', { type: 'array', items: { type: 'string' } }).valid).toBe(true);
    expect(validate('[]', { type: 'array', items: { type: 'string' } }).valid).toBe(true);
    expect(validate('["1", "2", "3"]', { type: 'array', items: { type: 'integer' } }).valid).toBe(true);
    expect(validate('["1.0", "2.0", "3.0"]', { type: 'array', items: { type: 'float' } }).valid).toBe(true);
    expect(validate('["true", "false"]', { type: 'array', items: { type: 'boolean' } }).valid).toBe(true);
  });

  it('array fail', () => {
    expect(validate('{"a": "b"}', { type: 'array', items: { type: 'string' } }).valid).toBe(false);
    expect(validate('"not an array"', { type: 'array', items: { type: 'string' } }).valid).toBe(false);
    expect(validate('123', { type: 'array', items: { type: 'string' } }).valid).toBe(false);
    expect(validate('true', { type: 'array', items: { type: 'string' } }).valid).toBe(false);
    expect(validate('["1", "2"]', { type: 'array', items: { type: 'float' } }).valid).toBe(false);
  });

  it('array error message', () => {
    const result = validate('{"a": "b"}', { type: 'array', items: { type: 'string' } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'must be array' }]);
  });

  it('array item error message', () => {
    const result = validate('["1", "2", "three"]', { type: 'array', items: { type: 'integer' } });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value[2]', message: 'must be integer' }]);
  });
});