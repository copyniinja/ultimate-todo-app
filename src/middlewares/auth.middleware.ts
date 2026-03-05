export function createAuthMiddleware() {
  async function authenticate() {}
  async function authorization() {}

  return {
    authenticate,
    authorization,
  };
}

export type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
