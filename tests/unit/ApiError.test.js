import ApiError from '../../src/utils/ApiError.js';

describe('ApiError', () => {
  it('should create an error with message and status code', () => {
    const error = new ApiError('Not found', 404);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.errors).toEqual([]);
    expect(error.isOperational).toBe(true);
  });

  it('should create an error with validation errors array', () => {
    const validationErrors = [
      { field: 'email', message: 'Valid email is required' },
    ];
    const error = new ApiError('Validation failed', 400, validationErrors);

    expect(error.statusCode).toBe(400);
    expect(error.errors).toEqual(validationErrors);
  });

  it('should default to status 500 and empty errors', () => {
    const error = new ApiError('Internal server error');

    expect(error.statusCode).toBe(500);
    expect(error.errors).toEqual([]);
  });
});
