import {
  beforeAll,
  describe,
  expect,
  test
} from "@jest/globals";

import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  hashPassword,
  verifyAccessToken,
  verifyRefreshToken
} from "../../packages/auth/src/index";

beforeAll(() => {
  process.env.ACCESS_TOKEN_SECRET =
    "test-access-secret-123456";

  process.env.REFRESH_TOKEN_SECRET =
    "test-refresh-secret-123456";
});

describe("Auth Unit Tests", () => {
  test(
    "should hash a password",
    async () => {
      const password =
        "123456";

      const hashedPassword =
        await hashPassword(
          password
        );

      expect(
        hashedPassword
      ).not.toBe(
        password
      );
    }
  );

  test(
    "should accept correct password",
    async () => {
      const password =
        "123456";

      const hashedPassword =
        await hashPassword(
          password
        );

      const result =
        await comparePassword(
          password,
          hashedPassword
        );

      expect(
        result
      ).toBe(true);
    }
  );

  test(
    "should reject wrong password",
    async () => {
      const hashedPassword =
        await hashPassword(
          "123456"
        );

      const result =
        await comparePassword(
          "wrong-password",
          hashedPassword
        );

      expect(
        result
      ).toBe(false);
    }
  );

  test(
    "should create and verify access token",
    () => {
      const token =
        createAccessToken({
          userId: "123",
          email:
            "test@example.com",
          role: "user"
        });

      const decoded =
        verifyAccessToken(
          token
        );

      expect(
        decoded.userId
      ).toBe("123");

      expect(
        decoded.email
      ).toBe(
        "test@example.com"
      );

      expect(
        decoded.role
      ).toBe("user");
    }
  );

  test(
    "should create and verify refresh token",
    () => {
      const token =
        createRefreshToken(
          "123"
        );

      const decoded =
        verifyRefreshToken(
          token
        );

      expect(
        decoded.userId
      ).toBe("123");
    }
  );
});