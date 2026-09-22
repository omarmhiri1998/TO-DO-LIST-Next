import {
  redirect
} from "next/navigation";

import {
  getDatabase
} from "./lib/database";

import {
  getCurrentUser
} from "./lib/session";

import TodoDashboard
  from "../components/TodoDashboard";

export default async function HomePage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect(
      "/login"
    );
  }

  const db =
    await getDatabase();

  const todos =
    await db
      .collection("todos")
      .find({
        userId:
          user.userId
      })
      .sort({
        createdAt: -1
      })
      .toArray();

  const serializedTodos =
    todos.map(
      (todo) => ({
        id:
          todo._id.toString(),

        category:
          todo.category ||
          "work",

        contain:
          todo.contain ||
          "",

        date:
          todo.date ||
          "",

        time:
          todo.time ||
          "",

        important:
          Boolean(
            todo.important
          ),

        completed:
          Boolean(
            todo.completed
          )
      })
    );

  return (
    <TodoDashboard
      user={{
        email:
          user.email,

        role:
          user.role
      }}

      initialTodos={
        serializedTodos
      }
    />
  );
}