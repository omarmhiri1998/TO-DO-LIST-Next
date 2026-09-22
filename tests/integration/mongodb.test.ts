import {
  afterAll,
  beforeAll,
  describe,
  expect,
  test
} from "@jest/globals";

import path from "node:path";

import dotenv from "dotenv";

import {
  MongoClient
} from "mongodb";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    "apps/web/.env.local"
  )
});

describe(
  "MongoDB Integration Tests",
  () => {
    let client:
      MongoClient;

    const databaseName =
      "todo_test_db";

    beforeAll(
      async () => {
        const uri =
          process.env.MONGODB_URI;

        if (!uri) {
          throw new Error(
            "MONGODB_URI is missing"
          );
        }

        client =
          new MongoClient(
            uri
          );

        await client.connect();
      },
      30000
    );

    afterAll(
      async () => {
        if (client) {
          const db =
            client.db(
              databaseName
            );

          await db
            .collection(
              "todos"
            )
            .deleteMany({});

          await client.close();
        }
      }
    );

    test(
      "should create a todo",
      async () => {
        const db =
          client.db(
            databaseName
          );

        const todos =
          db.collection(
            "todos"
          );

        const result =
          await todos.insertOne({
            userId:
              "test-user",

            contain:
              "Integration Test Todo",

            category:
              "work",

            completed:
              false
          });

        expect(
          result.acknowledged
        ).toBe(true);

        expect(
          result.insertedId
        ).toBeDefined();
      }
    );

    test(
      "should read a todo",
      async () => {
        const db =
          client.db(
            databaseName
          );

        const todo =
          await db
            .collection(
              "todos"
            )
            .findOne({
              contain:
                "Integration Test Todo"
            });

        expect(
          todo
        ).not.toBeNull();

        expect(
          todo?.userId
        ).toBe(
          "test-user"
        );
      }
    );

    test(
      "should update a todo",
      async () => {
        const db =
          client.db(
            databaseName
          );

        await db
          .collection(
            "todos"
          )
          .updateOne(
            {
              contain:
                "Integration Test Todo"
            },
            {
              $set: {
                completed:
                  true
              }
            }
          );

        const todo =
          await db
            .collection(
              "todos"
            )
            .findOne({
              contain:
                "Integration Test Todo"
            });

        expect(
          todo?.completed
        ).toBe(true);
      }
    );

    test(
      "should delete a todo",
      async () => {
        const db =
          client.db(
            databaseName
          );

        const result =
          await db
            .collection(
              "todos"
            )
            .deleteOne({
              contain:
                "Integration Test Todo"
            });

        expect(
          result.deletedCount
        ).toBe(1);
      }
    );
  }
);