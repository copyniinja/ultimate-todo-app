import { Env } from "@/configs/env";
import { UserService } from "@/services/user.service";

export function createTokenService(env: Env, userService: UserService) {
  // generate jwt token
  function generate() {}
  // verify jwt token
  function verify() {}

  return {
    generate,
    verify,
  };
}

export type TokenService = ReturnType<typeof createTokenService>;
