import dns from "node:dns";

export const runtime =
  "nodejs";

export default async function DbTestPage() {
  try {
    dns.setServers([
      "8.8.8.8",
      "1.1.1.1"
    ]);

    const {
      getDb
    } =
      await import(
        "@todo/db"
      );

    const db =
      await getDb();

    await db.command({
      ping: 1
    });

    return (
      <main>
        <h1>
          MongoDB connected ✅
        </h1>

        <p>
          Database:{" "}
          {db.databaseName}
        </p>
      </main>
    );

  } catch (error) {
    console.error(
      "MongoDB ERROR:",
      error
    );

    return (
      <main>
        <h1>
          MongoDB failed ❌
        </h1>
      </main>
    );
  }
}