import { registerUserSchema } from "@/validators";

describe("User validator", () => {
  // Register user
  describe("registerUserValidator", () => {
    it("should validate correct user registration data", () => {
      const validUser = {
        body: {
          email: "dummy@gmail.com",
          name: "dummy bhai",
          password: "dummy123",
          role: "ADMIN",
        },
      };
      const result = registerUserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        body: {
          email: "dummy123.invalid",
          name: "dummy bhai",
          password: "dummy123",
        },
      };
      const result = registerUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
