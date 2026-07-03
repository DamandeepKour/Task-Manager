export const sanitizeUser = (user) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};
