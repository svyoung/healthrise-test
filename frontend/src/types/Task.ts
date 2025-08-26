export type Task = {
  id: string|number;
  title: string;
  assigneeId: string|number;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done' | string;
  comments?: any[];
  metadata?: any;
};
