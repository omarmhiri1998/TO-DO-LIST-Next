"use server";

import {
  ObjectId
} from "mongodb";

import {
  revalidatePath
} from "next/cache";

import {
  getDatabase
} from "../lib/database";

import {
  requireAdmin
} from "../lib/session";

export async function updateUserRoleAction(
  id: string,
  role: "user" | "admin"
) {
  try {
    const admin =
      await requireAdmin();

    if (
      !ObjectId.isValid(id)
    ) {
      return {
        success: false,
        message:
          "Invalid user"
      };
    }

    if (
      role !== "user" &&
      role !== "admin"
    ) {
      return {
        success: false,
        message:
          "Invalid role"
      };
    }

    if (
      admin.userId === id &&
      role !== "admin"
    ) {
      return {
        success: false,
        message:
          "You cannot remove your own admin role"
      };
    }

    const db =
      await getDatabase();

    const result =
      await db
        .collection("users")
        .updateOne(
          {
            _id:
              new ObjectId(id)
          },
          {
            $set: {
              role
            }
          }
        );

    if (
      result.matchedCount === 0
    ) {
      return {
        success: false,
        message:
          "User not found"
      };
    }

    revalidatePath(
      "/admin"
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Update role error:",
      error
    );

    return {
      success: false,
      message:
        "Could not update role"
    };
  }
}

export async function deleteUserAction(
  id: string
) {
  try {
    const admin =
      await requireAdmin();

    if (
      !ObjectId.isValid(id)
    ) {
      return {
        success: false,
        message:
          "Invalid user"
      };
    }

    if (
      admin.userId === id
    ) {
      return {
        success: false,
        message:
          "You cannot delete your own account"
      };
    }

    const db =
      await getDatabase();

    const user =
      await db
        .collection("users")
        .findOne({
          _id:
            new ObjectId(id)
        });

    if (!user) {
      return {
        success: false,
        message:
          "User not found"
      };
    }

    await db
      .collection("users")
      .deleteOne({
        _id:
          new ObjectId(id)
      });

    await db
      .collection("todos")
      .deleteMany({
        userId: id
      });

    revalidatePath(
      "/admin"
    );

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return {
      success: false,
      message:
        "Could not delete user"
    };
  }
}