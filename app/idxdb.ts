import { DatabaseFactory, type MigrationInterface } from "@idxdb/promised";

const requestedVersion = 1;

const migrations: MigrationInterface[] = [
  {
    version: requestedVersion,
    migration: async ({ db }) => {
      for (const store of db.objectStoreNames) {
        db.deleteObjectStore(store); // correctly delete all previous existing stores
      }
      // creates the fresh new stores and their indexes
      const store = db.createObjectStore("projects", {
        keyPath: "id",
        autoIncrement: true,
      });
      store.createIndex("name_idx", "name", { unique: false });
      store.createIndex("description_idx", "description", { unique: false });
      store.createIndex("budget_idx", "budget", { unique: false });
      store.createIndex("status_idx", "status", { unique: false });
      store.createIndex("expenseIds_idx", "expenseIds", { unique: false });
      //...
    },
  },
];

export async function getDb() {
  return await DatabaseFactory.open(
    "budget-wise-database",
    requestedVersion,
    migrations
  );
}
