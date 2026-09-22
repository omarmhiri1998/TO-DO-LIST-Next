import dns from "node:dns";

import type {
  Db,
  MongoClient as MongoClientType
} from "mongodb";

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

let client:
  MongoClientType | null =
    null;

let db:
  Db | null =
    null;

export async function connectMongoDB() {
  if (db) {
    return db;
  }

  const uri =
    process.env.MONGODB_URI;

  const dbName =
    process.env.MONGODB_DB;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing"
    );
  }

  if (!dbName) {
    throw new Error(
      "MONGODB_DB is missing"
    );
  }

  if (!client) {
    const {
      MongoClient
    } =
      await import(
        "mongodb"
      );

    client =
      new MongoClient(
        uri
      );
  }

  await client.connect();

  db =
    client.db(
      dbName
    );

  console.log(
    "MongoDB Atlas connected"
  );

  return db;
}

export async function getDb() {
  if (!db) {
    return await connectMongoDB();
  }

  return db;
}