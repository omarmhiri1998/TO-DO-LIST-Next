export async function getDatabase() {
  const {
    getDb
  } =
    await import(
      "@todo/db"
    );

  return await getDb();
}