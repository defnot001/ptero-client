import { describe, expect, it } from 'vitest';
import PteroClient from './client/classes/PteroClient';
import { PterodactylError } from './client/classes/PterodactylError';
import { ValidationError } from './client/classes/ValidationError';
import { client } from './test';

describe('testPteroClientConstructor', () => {
  it('should return an instance of PteroClient', () => {
    expect(
      new PteroClient({
        hostURL: 'https://example.com',
        apiKey: '1234567890',
      }),
    ).toBeInstanceOf(PteroClient);
  });

  it('should throw an error, if the auth details are missing.', () => {
    expect(() => new PteroClient({ hostURL: '', apiKey: '' })).toThrowError(
      'Missing/invalid base URL and/or API key!',
    );
  });
});

describe('testIsPterodactylError', () => {
  const pteroError = new PterodactylError({
    code: 'test',
    status: '500',
    detail: 'Internal Server Error',
  });

  it('should return true', () => {
    expect(client.isPterodactylError(pteroError)).toBe(true);
  });

  it('should return false', () => {
    expect(client.isPterodactylError(new Error())).toBe(false);
  });
});

describe('testIsValidationError', () => {
  const validationError = new ValidationError();

  it('should return true', () => {
    expect(client.isValidationError(validationError)).toBe(true);
  });

  it('should return false', () => {
    expect(client.isValidationError(new Error())).toBe(false);
  });
});
