import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('union ok', () => {
    expect(validate('123', { type: 'union', anyOf: [{ type: 'integer' }, { type: 'string' }] }).valid).toBe(true);
    expect(validate('"hello"', { type: 'union', anyOf: [{ type: 'integer' }, { type: 'string' }] }).valid).toBe(true);
    expect(validate('true', { type: 'union', anyOf: [{ type: 'boolean' }, { type: 'string' }] }).valid).toBe(true);
    expect(validate('{user: "Alice"}', { type: 'union', anyOf: [{ type: 'object', properties: { user: { type: 'string' } }, required: ['user'] }, { type: 'string' }] }).valid).toBe(true);
  });

  it('union fail', () => {
    expect(validate('123.45', { type: 'union', anyOf: [{ type: 'integer' }, { type: 'boolean' }] }).valid).toBe(false);
    expect(validate('false', { type: 'union', anyOf: [{ type: 'integer' }, { type: 'number' }] }).valid).toBe(false);
    expect(validate('null', { type: 'union', anyOf: [{ type: 'boolean' }, { type: 'float' }] }).valid).toBe(false);
    expect(validate('{"user": "Alice"}', { type: 'union', anyOf: [{ type: 'object', properties: { user: { type: 'integer' } }, required: ['user'] }, { type: 'integer' }] }).valid).toBe(false);
  });

  it('union error message', () => {
    const result = validate('123.45', { type: 'union', anyOf: [{ type: 'integer' }, { type: 'boolean' }] });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value', message: 'no union match' }]);
  });
});