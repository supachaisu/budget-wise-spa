import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { Expense, NewExpense, NewProject, Project } from '~/entites'
import {
  ExpenseRepositoryUsingIndexedDB,
  ProjectRepositoryUsingIndexedDB,
} from '~/repositories'
import { getDb } from '~/idxdb'
import { ReceiptTextIcon } from 'lucide-react'

export function ProjectModal({
  open,
  setOpen,
  project,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  project: Project
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSavingProject, setIsSavingProject] = useState(false)
  const [expenses, setExpenses] = useState<Expense[]>([])

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSavingProject(true)

    const formData = new FormData(e.target as HTMLFormElement)

    // Validate form data
    if (
      !formData.get('name') ||
      !formData.get('description') ||
      !formData.get('budget')
    ) {
      return
    }

    const budget = formData.get('budget') as string
    const newProject: NewProject = {
      name: (formData.get('name') as string).trim(),
      description: (formData.get('description') as string).trim(),
      budget: Number(budget.replace(/,/g, '')),
      status: 'active',
    }
    const projectRepository = new ProjectRepositoryUsingIndexedDB(await getDb())

    await projectRepository.create(newProject)

    setIsSavingProject(false)
    setOpen(false)
  }

  useEffect(() => {
    getDb().then((db) => {
      const expenseRepository = new ExpenseRepositoryUsingIndexedDB(db)
      expenseRepository.listByProjectId(project.id).then((expenses) => {
        setExpenses(
          expenses.sort(
            (a, b) => b.dateCreated.getTime() - a.dateCreated.getTime(),
          ),
        )
      })
    })
  }, [project.id])

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-950/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">
                {isEditing ? 'Edit Project' : project.name}
              </h1>
              {!isEditing && (
                <div className="mt-2">
                  <p>{project.description}</p>
                </div>
              )}
            </div>
            {isEditing ? (
              <form onSubmit={handleCreateProject} className="mt-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Project Name"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm/6"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2">
                    <input
                      id="description"
                      name="description"
                      type="text"
                      placeholder="Project Description"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm/6"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="budget"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Budget
                  </label>
                  <div className="mt-2">
                    <input
                      id="budget"
                      name="budget"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9,]*\.?[0-9]*"
                      placeholder="0.00"
                      required
                      onInput={(e) => {
                        const value = e.currentTarget.value.replace(
                          /[^\d.]/g,
                          '',
                        )
                        const parts = value.split('.')
                        if (parts[0]) {
                          parts[0] = parts[0].replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ',',
                          )
                        }
                        e.currentTarget.value = parts.join('.')
                      }}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between gap-x-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:translate-y-px"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSavingProject}
                    className="rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:translate-y-px"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="mt-4 flex items-center gap-x-2">
                  <h2 className="text-lg font-extrabold">Budget:</h2>
                  <p className="font-medium">
                    {project.budget.toLocaleString()}
                  </p>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-extrabold">Expenses</h2>
                  <div className="mt-2">
                    <AddExpenseForm
                      projectId={project.id}
                      onAddExpense={(expense) =>
                        setExpenses((prev) => [expense, ...prev])
                      }
                    />
                  </div>
                  <ul className="mt-4 max-h-52 space-y-4 divide-y divide-gray-200 overflow-auto">
                    {expenses.map((expense) => (
                      <li
                        key={expense.id}
                        className="flex items-center gap-x-2 pt-4"
                      >
                        <ReceiptTextIcon className="size-8 shrink-0" />
                        <div>
                          <p>{expense.name}</p>
                          <p className="text-sm text-gray-500">
                            {expense.amount.toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

function AddExpenseForm({
  projectId,
  onAddExpense,
}: {
  projectId: Project['id']
  onAddExpense: (expense: Expense) => void
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const expenseName = formData.get('expenseName') as string
    const expenseAmount = Number(
      (formData.get('expenseAmount') as string).replace(/,/g, ''),
    )

    const newExpense: NewExpense = {
      name: expenseName,
      amount: expenseAmount,
      dateCreated: new Date(),
      projectId,
    }

    const expenseRepository = new ExpenseRepositoryUsingIndexedDB(await getDb())
    const expense = await expenseRepository.create(newExpense)
    onAddExpense(expense)

    formRef.current?.reset()
    const expenseNameInput = formRef.current?.elements.namedItem('expenseName')
    if (expenseNameInput) {
      ;(expenseNameInput as HTMLInputElement).focus()
    }
  }

  return (
    <form onSubmit={handleAddExpense} ref={formRef}>
      <label
        htmlFor="email"
        className="block text-sm/6 font-medium text-gray-900"
      >
        Add Expense
      </label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="flex -space-x-px">
          <div className="relative flex grow items-stretch focus-within:z-10">
            <input
              id="expenseName"
              name="expenseName"
              type="text"
              placeholder="Expense Name"
              className="relative block w-full rounded-none rounded-l-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm/6"
              required
            />
          </div>
          <div className="relative flex grow items-stretch focus-within:z-10">
            <input
              id="expenseAmount"
              name="expenseAmount"
              type="text"
              inputMode="numeric"
              pattern="[0-9,]*\.?[0-9]*"
              placeholder="0.00"
              onInput={(e) => {
                const value = e.currentTarget.value.replace(/[^\d.]/g, '')
                const parts = value.split('.')
                if (parts[0]) {
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                e.currentTarget.value = parts.join('.')
              }}
              className="relative block w-full rounded-none border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm/6"
              required
            />
          </div>
        </div>
        <button className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Add
        </button>
      </div>
    </form>
  )
}
