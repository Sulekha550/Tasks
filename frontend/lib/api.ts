import { Project, Task } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store'
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || 'Request failed');
  }
  return response.json();
}

export const guestLogin = () => request<{ user: { id: string; name: string; email: string; role: string }; session: string }>('/auth/guest', { method: 'POST' });

export const getTasks = () => request<Task[]>('/tasks');
export const createTask = (data: Partial<Task>) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) });
export const updateTask = (id: string, data: Partial<Task>) => request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteTask = (id: string) => request<{ ok: boolean }>(`/tasks/${id}`, { method: 'DELETE' });

export const addComment = (id: string, body: string, author = 'Ankit Dutta') =>
  request<Task>(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify({ body, author }) });

export const addSubtask = (id: string, data: { title: string; priority?: string; member?: string; dueDate?: string }) =>
  request<Task>(`/tasks/${id}/subtasks`, { method: 'POST', body: JSON.stringify(data) });

export const getProjects = () => request<Project[]>('/projects');
export const createProject = (data: Partial<Project>) => request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) });
export const updateProject = (id: string, data: Partial<Project>) => request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
export const deleteProject = (id: string) => request<{ ok: boolean }>(`/projects/${id}`, { method: 'DELETE' });
