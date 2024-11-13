import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { NewProject } from '~/entites'
import { ProjectRepositoryUsingIndexedDB } from '~/repositories'
import { getDb } from '~/idxdb'

export function CreateProjectModal({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsCreatingProject(true)

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
      expenseIds: [],
    }
    const projectRepository = new ProjectRepositoryUsingIndexedDB(await getDb())

    await projectRepository.create(newProject)

    setIsCreatingProject(false)
    setOpen(false)
  }

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
            <h1 className="text-lg font-extrabold text-gray-900">
              Create Project
            </h1>
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
                      const value = e.currentTarget.value.replace(/[^\d.]/g, '')
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
                  disabled={isCreatingProject}
                  className="rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:translate-y-px"
                >
                  Create
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
