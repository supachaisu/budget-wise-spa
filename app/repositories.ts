import type { NewProject, Project } from "./entites";

interface ProjectRepository {
  getAll: () => Promise<Project[]>;
  getById: (id: number) => Promise<Project | null>;
  create: (project: NewProject) => Promise<Project>;
  update: (project: Project) => Promise<Project>;
  delete: (id: number) => Promise<void>;
}
