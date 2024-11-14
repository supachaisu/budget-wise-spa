import { PackageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Expense, Project } from '~/entites'
import { getDb } from '~/idxdb'
import {
  ExpenseRepositoryUsingIndexedDB,
  ProjectRepositoryUsingIndexedDB,
} from '~/repositories'
import { ProjectModal } from './project-modal'

export function ProjectList({
  createProjectModalToggled,
}: {
  createProjectModalToggled: boolean
}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  useEffect(() => {
    getDb().then((db) => {
      const projectRepository = new ProjectRepositoryUsingIndexedDB(db)
      projectRepository
        .getAll()
        .then((projects) => {
          const expenseRepository = new ExpenseRepositoryUsingIndexedDB(db)
          Promise.all(
            projects.map((project) =>
              expenseRepository.listByProjectId(project.id),
            ),
          ).then((expenses) => {
            setProjects(projects)
            setExpenses(expenses.flat())
          })
        })
        .catch((error) => {
          console.error(error)
        })
    })
  }, [createProjectModalToggled])

  return (
    <ul className="space-y-8">
      {projects.map((project) => (
        <li key={project.id} className="max-w-md rounded-lg">
          <button
            type="button"
            className="flex w-full max-w-md items-center justify-between gap-x-2 rounded-lg border-2 border-gray-200 p-4 hover:border-gray-300 active:translate-y-px dark:border-gray-500 dark:hover:border-gray-400"
            onClick={() => {
              setCurrentProject(project)
              setIsProjectModalOpen(true)
            }}
          >
            <div className="flex items-center gap-x-2">
              <PackageIcon className="size-6 shrink-0" />
              <span className="font-bold">{project.name}</span>
            </div>
            <span className="font-medium">
              / {project.budget.toLocaleString()}
            </span>
          </button>
        </li>
      ))}
      {currentProject && (
        <ProjectModal
          open={isProjectModalOpen}
          setOpen={setIsProjectModalOpen}
          project={currentProject}
        />
      )}
    </ul>
  )
}
