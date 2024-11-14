//
// Project
//

export interface Project {
  id: number;
  name: string;
  description: string;
  budget: number;
  status: "active" | "inactive" | "archived";
}

export type NewProject = Omit<Project, "id">;

//
// Expense
//

export interface Expense {
  id: number;
  name: string;
  amount: number;
  dateCreated: Date;
  projectId: Project["id"];
}

export type NewExpense = Omit<Expense, "id">;
