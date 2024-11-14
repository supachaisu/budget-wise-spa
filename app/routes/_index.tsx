import type { MetaFunction } from '@remix-run/node'
import { Container } from '~/components/container'
import { CirclePlusIcon } from 'lucide-react'
import { useState } from 'react'
import { CreateProjectModal } from '~/components/create-project-modal'
import { ProjectList } from '~/components/project-list'

export const meta: MetaFunction = () => {
  return [
    { title: 'Budget Wise | ERP for project expense monitoring' },
    { name: 'description', content: 'An ERP for project expense monitoring' },
  ]
}

export default function Index() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
    useState(false)

  function toggleCreateProjectModal() {
    setIsCreateProjectModalOpen((prev) => !prev)
  }

  return (
    <main className="py-8">
      <section>
        <Container>
          <h1 className="text-lg font-extrabold">Projects</h1>

          <CreateProjectModal
            open={isCreateProjectModalOpen}
            setOpen={setIsCreateProjectModalOpen}
          />

          <button
            type="button"
            onClick={toggleCreateProjectModal}
            className="mt-4 inline-flex items-center gap-x-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 active:translate-y-px dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <CirclePlusIcon aria-hidden="true" className="-ml-0.5 size-5" />
            Create Project
          </button>

          <div className="mt-8">
            <ProjectList createProjectModalToggled={isCreateProjectModalOpen} />
          </div>
        </Container>
      </section>
    </main>
  )
}
