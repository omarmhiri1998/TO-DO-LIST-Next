import {
  ObjectId
} from "mongodb";

import {
  cookies
} from "next/headers";

import {
  verifyAccessToken,
  verifyRefreshToken
} from "@todo/auth";

import {
  getDatabase
} from "./database";

export type SessionUser = {
  userId: string;
  email: string;
  role: string;
};

export async function getCurrentUser():
Promise<SessionUser | null> {
  const cookieStore =
    await cookies();

  const accessToken =
    cookieStore.get(
      "accessToken"
    )?.value;

  if (accessToken) {
    try {
      const decoded =
        verifyAccessToken(
          accessToken
        );

      return {
        userId:
          decoded.userId,

        email:
          decoded.email,

        role:
          decoded.role
      };

    } catch {
      // Access Token expired.
      // Try Refresh Token below.
    }
  }

  const refreshToken =
    cookieStore.get(
      "refreshToken"
    )?.value;

  if (!refreshToken) {
    return null;
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
      return null;
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
      return null;
    }

    return {
      userId:
        user._id.toString(),

      email:
        user.email,

      role:
        user.role ||
        "user"
    };

  } catch {
    return null;
  }
}

export async function requireUser() {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  return user;
}

export async function requireAdmin() {
  const user =
    await requireUser();

  if (
    user.role !==
    "admin"
  ) {
    throw new Error(
      "Admin access required"
    );
  }

  return user;
}