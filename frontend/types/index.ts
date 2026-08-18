export type Status = 'To Do' | 'Doing' | 'Completed' | 'On Hold';
export type Priority = 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';

export type Subtask = {
  id: string;
  title: string;
  priority: Priority;
  member: string;
  reporter?: string;
  dueDate: string;
  completed?: boolean;
};

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  member: string;
  reporter?: string;
  dueDate: string;
  labels: string[];
  projectId: string;
  subtasks: Subtask[];
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
};

export type Project = {
  id: string;
  name: string;
  color: string;
  description: string;
  taskCount?: number;
  lead?: string;
  priority?: Priority;
  dueDate?: string;
};
