const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendValidationError = (res, message) => {
  res.status(400).json({
    success: false,
    message,
    data: null,
  });
};

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !String(name).trim()) {
    return sendValidationError(res, 'Name is required');
  }

  if (!email || !String(email).trim()) {
    return sendValidationError(res, 'Email is required');
  }

  if (!EMAIL_REGEX.test(email)) {
    return sendValidationError(res, 'Valid email is required');
  }

  if (!password) {
    return sendValidationError(res, 'Password is required');
  }

  if (password.length < 8) {
    return sendValidationError(res, 'Password must be at least 8 characters');
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !String(email).trim()) {
    return sendValidationError(res, 'Email is required');
  }

  if (!EMAIL_REGEX.test(email)) {
    return sendValidationError(res, 'Valid email is required');
  }

  if (!password) {
    return sendValidationError(res, 'Password is required');
  }

  next();
};
