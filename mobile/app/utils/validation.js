export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isValidEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return lower.endsWith("@gmail.com");
};

export const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(password);
};
