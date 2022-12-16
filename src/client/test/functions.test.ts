import { describe, expect, it } from 'vitest';
import { client } from '../../test';
import PteroClient from '../classes/PteroClient';
import { PterodactylError, ValidationError } from '../classes/errors/Errors';

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
    expect(client.errors.isPterodactylError(pteroError)).toBe(true);
  });

  it('should return false', () => {
    expect(client.errors.isPterodactylError(new Error())).toBe(false);
  });
});

describe('testIsValidationError', () => {
  const validationError = new ValidationError();

  it('should return true', () => {
    expect(client.errors.isValidationError(validationError)).toBe(true);
  });

  it('should return false', () => {
    expect(client.errors.isValidationError(new Error())).toBe(false);
  });
});
