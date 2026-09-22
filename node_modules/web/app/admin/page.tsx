import {
  redirect
} from "next/navigation";

import {
  getDatabase
} from "../lib/database";

import {
  getCurrentUser
} from "../lib/session";

import AdminDashboard
  from "../../components/AdminDashboard";

export default async function AdminPage() {
  const currentUser =
    await getCurrentUser();

  if (!currentUser) {
    redirect(
      "/login"
    );
  }

  if (
    currentUser.role !==
    "admin"
  ) {
    redirect(
      "/"
    );
  }

  const db =
    await getDatabase();

  const users =
    await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            password: 0
          }
        }
      )
      .sort({
        createdAt: -1
      })
      .toArray();

  const serializedUsers =
    users.map(
      (user) => ({
        id:
          user._id.toString(),

        email:
          user.email || "",

        role:
          user.role ||
          "user",

        createdAt:
          user.createdAt
            ? new Date(
                user.createdAt
              ).toISOString()
            : null
      })
    );

  return (
    <AdminDashboard
      currentUserId={
        currentUser.userId
      }
      currentUserEmail={
        currentUser.email
      }
      initialUsers={
        serializedUsers
      }
    />
  );
}