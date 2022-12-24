import { describe, expect, it } from 'vitest';
import { PterodactylError, ValidationError } from '../classes/ErrorManager';
import PteroClient from '../client';
import { replaceVariables } from '../util/clientEndpoints';
import { client } from './test';

describe('testPteroClientConstructor', () => {
  it('should return an instance of PteroClient', () => {
    expect(
      new PteroClient({
        baseURL: 'https://example.com',
        apiKey: '1234567890',
      }),
    ).toBeInstanceOf(PteroClient);
  });

  it('should throw an error, if the auth details are missing.', () => {
    expect(() => new PteroClient({ baseURL: '', apiKey: '' })).toThrowError(
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

describe('test replace endpoint variables', () => {
  it('should replace the server ID variable', () => {
    expect(
      replaceVariables('/api/client/servers/:server_id/backups', {
        serverID: '1234567890',
      }),
    ).toBe('/api/client/servers/1234567890/backups');
  });

  it('should replace the backup ID variable', () => {
    expect(
      replaceVariables('/api/client/servers/:server_id/backups/:backup_id', {
        backupID: '0987654321',
      }),
    ).toBe('/api/client/servers/:server_id/backups/0987654321');

    it('should replace both variables', () => {
      expect(
        replaceVariables('/api/client/servers/:server_id/backups/:backup_id', {
          serverID: '1234567890',
          backupID: '0987654321',
        }),
      ).toBe('/api/client/servers/1234567890/backups/0987654321');
    });
  });
});
