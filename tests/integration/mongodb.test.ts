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
      MongoClient | null =
        null;

    let connected =
      false;

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

        connected =
          true;
      },
      30000
    );

    afterAll(
      async () => {
        if (
          client &&
          connected
        ) {
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
        if (!client) {
          throw new Error(
            "MongoDB client is not connected"
          );
        }

        const db =
          client.db(
            databaseName
          );

        const result =
          await db
            .collection(
              "todos"
            )
            .insertOne({
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
        if (!client) {
          throw new Error(
            "MongoDB client is not connected"
          );
        }

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
        if (!client) {
          throw new Error(
            "MongoDB client is not connected"
          );
        }

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
        if (!client) {
          throw new Error(
            "MongoDB client is not connected"
          );
        }

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