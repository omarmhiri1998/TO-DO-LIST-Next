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
  requireUser
} from "../lib/session";

export type TodoInput = {
  category: string;
  contain: string;
  date: string;
  time: string;
  important: boolean;
};

export async function createTodo(
  todo: TodoInput
) {
  try {
    const user =
      await requireUser();

    if (
      !todo.contain ||
      todo.contain.trim() === ""
    ) {
      return {
        success: false,
        message:
          "Task is required"
      };
    }

    const db =
      await getDatabase();

    await db
      .collection("todos")
      .insertOne({
        userId:
          user.userId,

        category:
          todo.category,

        contain:
          todo.contain.trim(),

        date:
          todo.date,

        time:
          todo.time,

        important:
          todo.important,

        completed: false,

        createdAt:
          new Date()
      });

    revalidatePath("/");

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Create todo error:",
      error
    );

    return {
      success: false,
      message:
        "Could not create task"
    };
  }
}

export async function updateTodo(
  id: string,
  todo: TodoInput
) {
  try {
    const user =
      await requireUser();

    if (
      !ObjectId.isValid(id)
    ) {
      return {
        success: false,
        message:
          "Invalid task"
      };
    }

    const db =
      await getDatabase();

    const result =
      await db
        .collection("todos")
        .updateOne(
          {
            _id:
              new ObjectId(id),

            userId:
              user.userId
          },
          {
            $set: {
              category:
                todo.category,

              contain:
                todo.contain.trim(),

              date:
                todo.date,

              time:
                todo.time,

              important:
                todo.important
            }
          }
        );

    if (
      result.matchedCount === 0
    ) {
      return {
        success: false,
        message:
          "Task not found"
      };
    }

    revalidatePath("/");

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Update todo error:",
      error
    );

    return {
      success: false,
      message:
        "Could not update task"
    };
  }
}

export async function deleteTodo(
  id: string
) {
  try {
    const user =
      await requireUser();

    if (
      !ObjectId.isValid(id)
    ) {
      return {
        success: false,
        message:
          "Invalid task"
      };
    }

    const db =
      await getDatabase();

    await db
      .collection("todos")
      .deleteOne({
        _id:
          new ObjectId(id),

        userId:
          user.userId
      });

    revalidatePath("/");

    return {
      success: true
    };

  } catch (error) {
    console.error(
      "Delete todo error:",
      error
    );

    return {
      success: false,
      message:
        "Could not delete task"
    };
  }
}

export async function toggleTodo(
  id: string,
  completed: boolean
) {
  try {
    const user =
      await requireUser();

    if (
      !ObjectId.isValid(id)
    ) {
      return {
        success: false
      };
    }

    const db =
      await getDatabase();

    await db
      .collection("todos")
      .updateOne(
        {
          _id:
            new ObjectId(id),

          userId:
            user.userId
        },
        {
          $set: {
            completed
          }
        }
      );

    revalidatePath("/");

    return {
      success: true
    };

  } catch {
    return {
      success: false
    };
  }
}