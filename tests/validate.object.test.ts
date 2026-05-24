import { describe, it, expect } from 'vitest';
import { validate } from '../src/validate.js';

describe('validate', () => {
  it('object ok', () => {
    expect(validate('{"name": "Alice", "age": 30}', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name', 'age'],
    }).valid).toBe(true);
  });

  it('object missing required field', () => {
    expect(validate('{"name": "Alice"}', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name', 'age'],
    }).valid).toBe(false);
  });

  it('object with wrong field type', () => {
    expect(validate('{"name": "Alice", "age": "thirty"}', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name', 'age'],
    }).valid).toBe(false);
  });

  it('object with additional fields', () => {
    expect(validate('{"name": "Alice", "age": 30, "extra": true}', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name', 'age'],
    }).valid).toBe(true);
  });

  it('object with nested object', () => {
    expect(validate('{"user": {"name": "Alice", "age": 30}}', {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name', 'age'],
        },
      },
      required: ['user'],
    }).valid).toBe(true);
  });

  it('object with nested object missing required field', () => {
    expect(validate('{"user": {"name": "Alice"}}', {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name', 'age'],
        },
      },
      required: ['user'],
    }).valid).toBe(false);
  });

  it('object with nested object wrong field type', () => {
    expect(validate('{"user": {"name": "Alice", "age": "thirty"}}', {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name', 'age'],
        },
      },
      required: ['user'],
    }).valid).toBe(false);
  });

  it('object error message', () => {
    const result = validate('{"name": "Alice", "age": "thirty"}', {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'integer' },
      },
      required: ['name', 'age'],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value.age', message: 'must be integer' }]);
  });

  it('object with nested object error message', () => {
    const result = validate('{"user": {"name": "Alice", "age": "thirty"}}', {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
          },
          required: ['name', 'age'],
        },
      },
      required: ['user'],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([{ path: 'value.user.age', message: 'must be integer' }]);
  });
});