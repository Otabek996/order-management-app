// src/utils/AuthService.ts
export const DUMMY_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

export const authenticate = (username: string, password: string) => {
  if (
    username === DUMMY_CREDENTIALS.username &&
    password === DUMMY_CREDENTIALS.password
  ) {
    return true; // Auth successful
  }
  return false; // Auth failed
};
