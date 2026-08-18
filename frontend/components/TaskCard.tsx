import { CalendarDays, CheckSquare, MoreHorizontal, Tag } from 'lucide-react';
import { Task } from '@/types';
import { Avatar } from './Avatar';

const priorityClass: Record<string, string> = {
  Urgent: 'task-priority urgent',
  High: 'task-priority high',
  Medium: 'task-priority medium',
  Low: 'task-priority low',
  'No Priority': 'task-priority none'
};

export function TaskCard({ task, onOpen }: { task: Task; onOpen: (task: Task) => void }) {
  const completed = task.subtasks?.filter(s => (s as any).completed).length || 0;
  const total = task.subtasks?.length || 0;

  return (
    <article
      className="task-card"
      onClick={() => onOpen(task)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen(task)}
    >
      <div className="task-card-top">
        <span className="task-card-title">{task.title}</span>
        <button
          aria-label="Task options"
          onClick={e => e.stopPropagation()}
          className="task-more"
        >
          <MoreHorizontal size={15} />
        </button>
      </div>

      {task.description && <p className="task-card-description">{task.description}</p>}

      <div className="task-card-meta">
        <span className="task-member">
          <Avatar name={task.member} />
          <span>{task.member}</span>
        </span>
        <span className={priorityClass[task.priority] || 'task-priority none'}>
          {task.priority}
        </span>
      </div>

      <div className="task-card-footer">
        <div className="task-card-tags">
          {task.labels.slice(0, 2).map((label, i) => (
            <span key={`${label}-${i}`} className="task-tag">
              <Tag size={9} />{label}
            </span>
          ))}
          {total > 0 && (
            <span className="task-subtasks">
              <CheckSquare size={10} />{completed}/{total}
            </span>
          )}
        </div>

        {task.dueDate && (
          <span className="task-due">
            <CalendarDays size={10} />{task.dueDate}
          </span>
        )}
      </div>
    </article>
  );
}
