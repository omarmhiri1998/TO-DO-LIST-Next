"use server";

import {
  ObjectId
} from "mongodb";

import {
  cookies
} from "next/headers";

import {
  getDatabase
} from "../lib/database";

import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  hashPassword,
  verifyRefreshToken
} from "@todo/auth";

type AuthData = {
  email: string;
  password: string;
};

function accessCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      "production",
    sameSite:
      "lax" as const,
    path: "/",
    maxAge:
      60 * 15
  };
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      "production",
    sameSite:
      "lax" as const,
    path: "/",
    maxAge:
      60 *
      60 *
      24 *
      7
  };
}

export async function registerAction(
  data: AuthData
) {
  try {
    const email =
      data.email
        .trim()
        .toLowerCase();

    const password =
      data.password;

    if (
      !email ||
      !password
    ) {
      return {
        success: false,
        message:
          "Email and password are required"
      };
    }

    const db =
      await getDatabase();

    const existingUser =
      await db
        .collection("users")
        .findOne({
          email
        });

    if (existingUser) {
      return {
        success: false,
        message:
          "User already exists"
      };
    }

    const hashedPassword =
      await hashPassword(
        password
      );

    await db
      .collection("users")
      .insertOne({
        email,
        password:
          hashedPassword,
        role: "user",
        createdAt:
          new Date()
      });

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return {
      success: false,
      message:
        "Registration failed"
    };
  }
}

export async function loginAction(
  data: AuthData
) {
  try {
    const email =
      data.email
        .trim()
        .toLowerCase();

    const password =
      data.password;

    const db =
      await getDatabase();

    const user =
      await db
        .collection("users")
        .findOne({
          email
        });

    if (!user) {
      return {
        success: false,
        message:
          "Invalid email or password"
      };
    }

    const passwordCorrect =
      await comparePassword(
        password,
        user.password
      );

    if (!passwordCorrect) {
      return {
        success: false,
        message:
          "Invalid email or password"
      };
    }

    const userId =
      user._id.toString();

    const role =
      user.role ||
      "user";

    const accessToken =
      createAccessToken({
        userId,
        email:
          user.email,
        role
      });

    const refreshToken =
      createRefreshToken(
        userId
      );

    const cookieStore =
      await cookies();

    cookieStore.set(
      "accessToken",
      accessToken,
      accessCookieOptions()
    );

    cookieStore.set(
      "refreshToken",
      refreshToken,
      refreshCookieOptions()
    );

    return {
      success: true,
      user: {
        userId,
        email:
          user.email,
        role
      }
    };

  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return {
      success: false,
      message:
        "Login failed"
    };
  }
}

export async function refreshAccessTokenAction() {
  const cookieStore =
    await cookies();

  const refreshToken =
    cookieStore.get(
      "refreshToken"
    )?.value;

  if (!refreshToken) {
    return {
      success: false
    };
  }

  try {
    const decoded =
      verifyRefreshToken(
        refreshToken
      );

    if (
      !ObjectId.isValid(
        decoded.userId
      )
    ) {
      throw new Error(
        "Invalid user id"
      );
    }

    const db =
      await getDatabase();

    const user =
      await db
        .collection("users")
        .findOne({
          _id:
            new ObjectId(
              decoded.userId
            )
        });

    if (!user) {
      cookieStore.delete(
        "accessToken"
      );

      cookieStore.delete(
        "refreshToken"
      );

      return {
        success: false
      };
    }

    const accessToken =
      createAccessToken({
        userId:
          user._id.toString(),

        email:
          user.email,

        role:
          user.role ||
          "user"
      });

    cookieStore.set(
      "accessToken",
      accessToken,
      accessCookieOptions()
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Refresh token error:",
      error
    );

    cookieStore.delete(
      "accessToken"
    );

    cookieStore.delete(
      "refreshToken"
    );

    return {
      success: false
    };
  }
}

export async function logoutAction() {
  const cookieStore =
    await cookies();

  cookieStore.delete(
    "accessToken"
  );

  cookieStore.delete(
    "refreshToken"
  );

  return {
    success: true
  };
}