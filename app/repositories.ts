import type { Database } from '@idxdb/promised'
import type { Expense, NewExpense, NewProject, Project } from './entites'

//
// Project
//

interface ProjectRepository {
  create: (project: NewProject) => Promise<Project>
  getAll: () => Promise<Project[]>
}

export class ProjectRepositoryUsingIndexedDB implements ProjectRepository {
  constructor(private db: Database) {}

  async create(project: NewProject): Promise<Project> {
    const tx = this.db.transaction(['projects'], 'readwrite')
    const store = tx.objectStore('projects')
    const projectId = await store.add<NewProject, number>(project)

    return { id: projectId, ...project }
  }

  async getAll(): Promise<Project[]> {
    const tx = this.db.transaction(['projects'], 'readonly')
    const store = tx.objectStore('projects')

    return await store.getAll()
  }
}

//
// Expense
//

interface ExpenseRepository {
  create: (expense: NewExpense) => Promise<Expense>
  listByProjectId: (projectId: Project['id']) => Promise<Expense[]>
}

export class ExpenseRepositoryUsingIndexedDB implements ExpenseRepository {
  constructor(private db: Database) {}

  async create({ amount, name, projectId }: NewExpense): Promise<Expense> {
    const tx = this.db.transaction(['expenses'], 'readwrite')
    const store = tx.objectStore('expenses')
    const dateCreated = new Date()

    const id = await store.add<NewExpense, number>({
      amount,
      name,
      dateCreated,
      projectId,
    })

    return { id, amount, name, dateCreated, projectId }
  }

  async listByProjectId(projectId: Project['id']): Promise<Expense[]> {
    const tx = this.db.transaction(['expenses'], 'readonly')
    const store = tx.objectStore('expenses')
    const allExpenses = await store.getAll<Expense, number>()

    return allExpenses.filter((expense) => expense.projectId === projectId)
  }
}
