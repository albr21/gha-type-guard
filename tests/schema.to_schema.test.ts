import { describe, it, expect } from 'vitest';
import { toSchema } from '../src/schema.js';

describe('toSchema', () => {
  it('string', () => {
    expect(toSchema({ type: 'string' })).toEqual({ type: 'string' });
    expect(toSchema({ type: 'string', pattern: '^\\d+$' })).toEqual({ type: 'string', pattern: '^\\d+$' });

  });

  it('integer', () => {
    expect(toSchema({ type: 'integer' })).toEqual({ type: 'integer' });
  });

  it('float', () => {
    expect(toSchema({ type: 'float' })).toEqual({ type: 'float' });
  });

  it('number', () => {
    expect(toSchema({ type: 'number' })).toEqual({ type: 'number' });
  });

  it('boolean', () => {
    expect(toSchema({ type: 'boolean' })).toEqual({ type: 'boolean' });
  });

  it('any', () => {
    expect(toSchema({ type: 'any' })).toEqual({ type: 'any' });
  });

  it('array', () => {
    expect(toSchema({ type: 'array', itemsType: 'string' })).toEqual({ type: 'array', items: { type: 'string' } });
  });

  it('enum', () => {
    expect(toSchema({ type: 'enum', enumValues: ['value1', 'value2'] })).toEqual({ type: 'enum', values: ['value1', 'value2'] });
  });

  it('object', () => {
    expect(toSchema({ type: 'object', propertyTypes: { name: { type: 'string' } } })).toEqual({
      type: 'object',
      properties: { name: { type: 'string' } },
    });
  });

  it('union', () => {
    expect(toSchema({ type: 'union', unionTypes: ['string', 'integer'] })).toEqual({
      type: 'union',
      anyOf: [{ type: 'string' }, { type: 'integer' }],
    });
  });

});

