import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export type AuthUser = {
  userId: string;
  email: string;
  role: string;
};

function getAccessSecret() {
  const secret =
    process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is missing"
    );
  }

  return secret;
}

function getRefreshSecret() {
  const secret =
    process.env.REFRESH_TOKEN_SECRET;

  if (!secret) {
    throw new Error(
      "REFRESH_TOKEN_SECRET is missing"
    );
  }

  return secret;
}

export async function hashPassword(
  password: string
) {
  return await bcrypt.hash(
    password,
    10
  );
}

export async function comparePassword(
  password: string,
  hashedPassword: string
) {
  return await bcrypt.compare(
    password,
    hashedPassword
  );
}

export function createAccessToken(
  user: AuthUser
) {
  return jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      role: user.role
    },
    getAccessSecret(),
    {
      expiresIn: "15m"
    }
  );
}

export function createRefreshToken(
  userId: string
) {
  return jwt.sign(
    {
      userId
    },
    getRefreshSecret(),
    {
      expiresIn: "7d"
    }
  );
}

export function verifyAccessToken(
  token: string
) {
  return jwt.verify(
    token,
    getAccessSecret()
  ) as AuthUser;
}

export function verifyRefreshToken(
  token: string
) {
  return jwt.verify(
    token,
    getRefreshSecret()
  ) as {
    userId: string;
  };
}