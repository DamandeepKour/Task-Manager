import { getPasswordValidationErrors, PASSWORD_RULES } from '../../src/utils/password.util.js';

describe('Password Validation', () => {
  it('should pass for a strong password', () => {
    expect(getPasswordValidationErrors('Password1!')).toEqual([]);
  });

  it('should fail when password is too short', () => {
    const errors = getPasswordValidationErrors('Pass1!');
    expect(errors).toContain('Password must be at least 8 characters');
  });

  it('should fail when missing uppercase letter', () => {
    const errors = getPasswordValidationErrors('password1!');
    expect(errors).toContain('Password must contain at least one uppercase letter');
  });

  it('should fail when missing lowercase letter', () => {
    const errors = getPasswordValidationErrors('PASSWORD1!');
    expect(errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should fail when missing number', () => {
    const errors = getPasswordValidationErrors('Password!');
    expect(errors).toContain('Password must contain at least one number');
  });

  it('should fail when missing special character', () => {
    const errors = getPasswordValidationErrors('Password1');
    expect(errors).toContain('Password must contain at least one special character');
  });

  it('should define all required password rules', () => {
    expect(PASSWORD_RULES).toHaveLength(5);
  });
});
