//
// Project
//

export interface Project {
  id: number;
  name: string;
  description: string;
  budget: number;
  status: "active" | "inactive" | "archived";
  expenses: Expense[];
}

export type NewProject = Omit<Project, "id">;

//
// Expense
//

export interface Expense {
  id: number;
  name: string;
  amount: number;
  date: Date;
}

export type NewExpense = Omit<Expense, "id">;
