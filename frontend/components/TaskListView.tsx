'use client';

import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { Task, Status } from '@/types';
import { Avatar } from './Avatar';
import { Fields } from './FilterMenu';

const statuses: Status[] = ['To Do', 'Doing', 'Completed', 'On Hold'];

const priorityClass: Record<string, string> = {
  Urgent: 'text-red-500',
  High: 'text-red-400',
  Medium: 'text-orange-400',
  Low: 'text-sky-400',
  'No Priority': 'muted'
};

function Priority({ value }: { value: string }) {
  if (value === 'No Priority') return <span className="muted">No Priority</span>;
  return <span className={`inline-flex items-center gap-1 ${priorityClass[value] || 'muted'}`}><span className="text-[9px]">↗</span>{value}</span>;
}

export function TaskListView({
  tasks,
  fields,
  onOpen,
  onAdd
}: {
  tasks: Task[];
  fields: Fields;
  onOpen: (task: Task) => void;
  onAdd: (status: Status) => void;
}) {
  return (
    <div className="list-view space-y-4">
      {statuses.map(status => {
        const rows = tasks.filter(task => task.status === status);
        return (
          <section key={status} className="list-section">
            <button className="list-section-title" type="button">
              <ChevronDown size={12} />
              <span>{status}</span>
            </button>
            <div className="list-table-wrap">
              <table className="list-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    {fields.priority && <th>Priority</th>}
                    {fields.members && <th>Members</th>}
                    {fields.dueDate && <th>Due Date</th>}
                    {fields.labels && <th>Labels</th>}
                    {fields.status && <th>Status</th>}
                    {fields.reporter && <th>Reporter</th>}
                    <th className="actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(task => (
                    <tr key={task.id} onClick={() => onOpen(task)}>
                      <td className="task-name-cell">{task.title}</td>
                      {fields.priority && <td><Priority value={task.priority} /></td>}
                      {fields.members && <td><span className="member-cell"><Avatar name={task.member} size={22} /><span>{task.member}</span></span></td>}
                      {fields.dueDate && <td>{task.dueDate || '-'}</td>}
                      {fields.labels && <td><span className="table-labels">{task.labels.slice(0, 2).map(label => <span key={label}>{label}</span>)}</span></td>}
                      {fields.status && <td>{task.status}</td>}
                      {fields.reporter && <td>{task.reporter || task.member || 'Admin'}</td>}
                      <td className="actions-col"><button type="button" aria-label={`Actions for ${task.title}`} onClick={e => { e.stopPropagation(); onOpen(task); }} className="table-more"><MoreHorizontal size={14}/></button></td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={8} className="empty-list">No tasks in this section.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <button type="button" className="list-add" onClick={() => onAdd(status)}><Plus size={12}/> Add Task</button>
          </section>
        );
      })}
    </div>
  );
}
