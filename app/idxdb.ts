import { DatabaseFactory, type MigrationInterface } from '@idxdb/promised'

const requestedVersion = 3

const migrations: MigrationInterface[] = [
  {
    version: requestedVersion,
    migration: async ({ db }) => {
      for (const store of db.objectStoreNames) {
        db.deleteObjectStore(store) // correctly delete all previous existing stores
      }
      // creates the fresh new stores and their indexes
      const projectStore = db.createObjectStore('projects', {
        keyPath: 'id',
        autoIncrement: true,
      })
      projectStore.createIndex('name_idx', 'name', { unique: false })
      projectStore.createIndex('description_idx', 'description', {
        unique: false,
      })
      projectStore.createIndex('budget_idx', 'budget', { unique: false })
      projectStore.createIndex('status_idx', 'status', { unique: false })

      const expenseStore = db.createObjectStore('expenses', {
        keyPath: 'id',
        autoIncrement: true,
      })
      expenseStore.createIndex('name_idx', 'name', { unique: false })
      expenseStore.createIndex('amount_idx', 'amount', { unique: false })
      expenseStore.createIndex('dateCreated_idx', 'dateCreated', {
        unique: false,
      })
      expenseStore.createIndex('projectId_idx', 'projectId', { unique: false })
    },
  },
]

export async function getDb() {
  return await DatabaseFactory.open(
    'budget-wise-database',
    requestedVersion,
    migrations,
  )
}
