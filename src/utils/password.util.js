export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_RULES = [
  {
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
    message: 'Password must be at least 8 characters',
  },
  {
    test: (password) => /[A-Z]/.test(password),
    message: 'Password must contain at least one uppercase letter',
  },
  {
    test: (password) => /[a-z]/.test(password),
    message: 'Password must contain at least one lowercase letter',
  },
  {
    test: (password) => /[0-9]/.test(password),
    message: 'Password must contain at least one number',
  },
  {
    test: (password) => /[^A-Za-z0-9]/.test(password),
    message: 'Password must contain at least one special character',
  },
];

export const getPasswordValidationErrors = (password) =>
  PASSWORD_RULES.filter((rule) => !rule.test(password)).map((rule) => rule.message);
