import type { Database } from "@idxdb/promised";
import type { NewProject, Project } from "./entites";

interface ProjectRepository {
  create: (project: NewProject) => Promise<Project>;
}

export class ProjectRepositoryUsingIndexedDB implements ProjectRepository {
  constructor(private db: Database) {}

  async create(project: NewProject): Promise<Project> {
    const tx = this.db.transaction(["projects"], "readwrite");
    const store = tx.objectStore("projects");
    const projectId = await store.add<NewProject, number>(project);

    return { id: projectId, ...project };
  }
}
