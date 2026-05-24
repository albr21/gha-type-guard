import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as core from '@actions/core';
import { run } from '../src/index.js';

vi.mock('@actions/core', () => ({
  getInput: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  setFailed: vi.fn(),
}));

describe('run', () => {
  const mockedCore = vi.mocked(core);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate all items successfully', async () => {
    const payload = [
      { value: 'foo', type: 'string' },
      { value: 'bar', type: 'string', pattern: '^b' },
      { value: '1', type: 'integer' },
      { value: 'true', type: 'boolean' },
      { value: '1.0', type: 'float' },
      { value: '1', type: 'number' },
      { value: 'any value', type: 'any' },
      { value: '[1, 2, 3]', type: 'array', itemsType: 'integer' },
      { value: '{"name": "Alice"}', type: 'object', propertyTypes: { name: { type: 'string' } }, required: ['name'] },
      { value: 'value1', type: 'enum', enumValues: ['value1', 'value2'] },
      { value: '123', type: 'union', unionTypes: ['integer', 'string'] },
    ];

    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return JSON.stringify(payload);
      if (name === 'fail-fast') return 'false';
      return '';
    });

    await run();

    expect(mockedCore.error).not.toHaveBeenCalled();
    expect(mockedCore.setFailed).not.toHaveBeenCalled();
    expect(mockedCore.info).toHaveBeenCalledWith(
      '[gha-type-guard] All items validated successfully',
    );
  });

  it('should handle empty payload', async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return '[]';
      if (name === 'fail-fast') return 'false';
      return '';
    });
  
    await run();

    expect(mockedCore.error).not.toHaveBeenCalled();
    expect(mockedCore.setFailed).not.toHaveBeenCalled();
    expect(mockedCore.info).toHaveBeenCalledWith(
      '[gha-type-guard] All items validated successfully',
    );
  });

  it('shoud collect all validation errors', async () => {
    const payload = [
      { value: 'foo', type: 'string' },
      { value: 'bar', type: 'string', pattern: '^a' },
      { value: 'not an integer', type: 'integer' },
    ];

    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return JSON.stringify(payload);
      if (name === 'fail-fast') return 'false';
      return '';
    });

    await run();

    expect(mockedCore.error).toHaveBeenCalledTimes(2);

    expect(mockedCore.error).toHaveBeenCalledWith(
      '[gha-type-guard] item[1]: must match pattern ^a',
    );
    expect(mockedCore.error).toHaveBeenCalledWith(
      '[gha-type-guard] item[2]: must be integer',
    );
    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      '[gha-type-guard] Validation failed',
    );
    expect(mockedCore.info).not.toHaveBeenCalled();
  });

  it('should fail fast on first validation error', async () => {
    const payload = [
      { value: 'foo', type: 'string' },
      { value: 'bar', type: 'string', pattern: '^a' },
      { value: 'not an integer', type: 'integer' },
    ];

    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return JSON.stringify(payload);
      if (name === 'fail-fast') return 'true';
      return '';
    });

    await run();

    expect(mockedCore.error).toHaveBeenCalledTimes(1);
    expect(mockedCore.error).toHaveBeenCalledWith(
      '[gha-type-guard] item[1]: must match pattern ^a',
    );

    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      '[gha-type-guard] Validation failed',
    );
    expect(mockedCore.info).not.toHaveBeenCalled();
  });

  it('should handle invalid payload structure', async () => {
    const payload = [{ value: 'foo' }]; // missing type

    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return JSON.stringify(payload);
      if (name === 'fail-fast') return 'false';
      return '';
    });

    await run();

    expect(mockedCore.error).toHaveBeenCalledTimes(1);
    expect(mockedCore.error).toHaveBeenCalledWith(
      '[gha-type-guard] Each item must have either a schema or a type defined',
    );
    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      '[gha-type-guard] Validation failed',
    );
    expect(mockedCore.info).not.toHaveBeenCalled();
  });

  it('should handle invalid type in payload', async () => {
    const payload = [{ value: 'foo', type: 'unknown' }];

    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === 'payload') return JSON.stringify(payload);
      if (name === 'fail-fast') return 'false';
      return '';
    });

    await run();

    expect(mockedCore.error).toHaveBeenCalledTimes(1);
    expect(mockedCore.error).toHaveBeenCalledWith(
      '[gha-type-guard] Unknown type: unknown',
    );
    expect(mockedCore.setFailed).toHaveBeenCalledWith(
      '[gha-type-guard] Validation failed',
    );
    expect(mockedCore.info).not.toHaveBeenCalled();
  });
});