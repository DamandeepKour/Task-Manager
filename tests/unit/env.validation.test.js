import { jest } from '@jest/globals';
import { validateEnv } from '../../src/config/env.validation.js';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not exit when required variables are present', () => {
    process.env.JWT_SECRET = 'test-secret';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should exit when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    validateEnv();

    expect(errorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);

    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
