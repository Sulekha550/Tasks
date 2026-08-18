'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Eye,
  Lock,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Send,
  Settings,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import { Task, Priority, Status } from '@/types';
import { Avatar } from './Avatar';
import { addComment, addSubtask, deleteTask, updateTask } from '@/lib/api';

const priorities: Priority[] = ['No Priority', 'Urgent', 'High', 'Medium', 'Low'];
const statuses: Status[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
const labels = ['Research', 'Design', 'Development', 'Testing', 'Deployment'];

function getMonthDays(month: Date) {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const totalDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
}

type Props = {
  task: Task;
  onClose: () => void;
  onSaved: (task: Task) => void;
  onDeleted: (id: string) => void;
  mode?: 'panel' | 'page';
  projectName?: string;
};

export function TaskDetail({
  task,
  onClose,
  onSaved,
  onDeleted,
  mode = 'panel',
  projectName,
}: Props) {
  const [current, setCurrent] = useState(task);
  const [comment, setComment] = useState('');
  const [subtask, setSubtask] = useState('');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendar, setCalendar] = useState(new Date(2026, 0, 1));
  const [startDate, setStartDate] = useState(task.dueDate || '10 Jan');
  const [endDate, setEndDate] = useState('');
  const [dateStep, setDateStep] = useState<'start' | 'end'>('start');

  useEffect(() => {
    setCurrent(task);
    setStartDate(task.dueDate || '10 Jan');
  }, [task]);

  const save = async (patch: Partial<Task>) => {
    try {
      const next = await updateTask(current.id, patch);
      setCurrent(next);
      onSaved(next);
    } catch (error) {
      console.error(error);
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    try {
      const next = await addComment(current.id, comment.trim());
      setCurrent(next);
      onSaved(next);
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const submitSubtask = async () => {
    if (!subtask.trim()) return;
    try {
      const next = await addSubtask(current.id, {
        title: subtask.trim(),
        priority: 'Medium',
        member: 'Admin',
        dueDate: '18 Sep 2026',
      });
      setCurrent(next);
      onSaved(next);
      setSubtask('');
    } catch (error) {
      console.error(error);
    }
  };

  const removeTask = async () => {
    try {
      await deleteTask(current.id);
      onDeleted(current.id);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const days = useMemo(() => getMonthDays(calendar), [calendar]);

  const chooseDate = (day: number) => {
    const label = `${day} ${calendar.toLocaleString('en-US', { month: 'short' })}`;
    if (dateStep === 'start') {
      setStartDate(label);
      setDateStep('end');
      return;
    }
    setEndDate(label);
    setDateStep('start');
    setCalendarOpen(false);
    save({ dueDate: label });
  };

  const shell = mode === 'page'
    ? 'task-detail-page-shell'
    : 'fixed inset-0 z-[60] flex justify-end bg-black/20';

  const panel = mode === 'page'
    ? 'task-detail-panel task-detail-page'
    : 'task-detail-panel';

  return (
    <div className={shell}>
      <section className={panel}>
        {/* Figma-style task header */}
        <div className="task-detail-topbar">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[10px] muted"
          >
            <ArrowLeft size={14} />
            Tasks
          </button>

          <div className="flex items-center gap-1">
            <button className="icon-button" aria-label="Private"><Lock size={12} /></button>
            <button className="icon-button" aria-label="Watch"><Eye size={12} /></button>
            <button className="icon-button" aria-label="Share"><Share2 size={12} /></button>
            <button className="icon-button" aria-label="Settings"><Settings size={12} /></button>
            <button onClick={removeTask} className="icon-button text-red-500" aria-label="Delete"><Trash2 size={12} /></button>
            <button onClick={onClose} className="icon-button" aria-label="Close"><X size={13} /></button>
          </div>
        </div>

        <div className="task-detail-content">
          <div className="task-detail-main">
            <div className="task-breadcrumb">
              Projects <span>›</span> {projectName || 'Website Redesign'}
            </div>

            <input
              value={current.title}
              onChange={(e) => setCurrent({ ...current, title: e.target.value })}
              onBlur={() => save({ title: current.title })}
              className="task-detail-title"
            />

            <textarea
              value={current.description}
              onChange={(e) => setCurrent({ ...current, description: e.target.value })}
              onBlur={() => save({ description: current.description })}
              className="task-detail-description"
              placeholder="Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively."
            />

            <div className="property-line">
              <span>Properties</span>
              <span className="designer-pill">A&nbsp; Designer</span>
              <span className="date-pill"><CalendarDays size={10} />{current.dueDate || '31 Jul'}</span>
            </div>

            <div className="detail-labels">
              <span>Labels</span>
              {labels.map((label) => (
                <button
                  key={label}
                  className={`label-pill ${current.labels.includes(label) ? 'selected' : ''}`}
                  onClick={() => save({
                    labels: current.labels.includes(label)
                      ? current.labels.filter((item) => item !== label)
                      : [...current.labels, label],
                  })}
                >
                  ◇ {label}
                </button>
              ))}
            </div>

            <div className="resource-line">
              <span>Resources</span>
              <button>⊕ Add document or link...</button>
            </div>

            {/* Subtasks */}
            <div className="subtasks-block">
              <div className="section-title">
                <span>⌄ Subtasks</span>
                <CirclePlus size={14} />
              </div>

              <div className="subtask-table">
                <div className="subtask-head">
                  <span>Task</span>
                  <span>Priority</span>
                  <span>Members</span>
                  <span>Due Date</span>
                  <span>Actions</span>
                </div>

                {current.subtasks.map((item) => (
                  <div className="subtask-row" key={item.id}>
                    <span>{item.title}</span>
                    <span className={`priority-text ${item.priority.toLowerCase().replace(' ', '-')}`}>
                      {item.priority}
                    </span>
                    <span><Avatar name={item.member} size={18} /></span>
                    <span>{item.dueDate || '-'}</span>
                    <span><MoreHorizontal size={12} /></span>
                  </div>
                ))}

                <div className="subtask-add">
                  <CirclePlus size={12} />
                  <input
                    value={subtask}
                    onChange={(e) => setSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submitSubtask()}
                    placeholder="Add Subtasks"
                  />
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="comments-block">
              <h3>Comments</h3>

              {current.comments.map((item) => (
                <div className="comment-card" key={item.id}>
                  <div className="flex items-center gap-2">
                    <Avatar name={item.author} size={20} />
                    <span className="text-[9px] font-semibold">{item.author}</span>
                    <span className="text-[8px] muted">just now</span>
                    <MoreHorizontal size={12} className="ml-auto muted" />
                  </div>
                  <p>{item.body}</p>
                </div>
              ))}

              <div className="comment-input">
                <MessageCircle size={13} className="muted" />
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                  placeholder="Add a comment..."
                />
                <Paperclip size={12} className="muted" />
                <button onClick={submitComment}><Send size={12} /></button>
              </div>
            </div>
          </div>

          {/* Right details panel */}
          <aside className="task-details-card">
            <div className="details-title">
              <span>⌄ Details</span>
              <div className="flex gap-1">
                <CirclePlus size={13} />
                <Settings size={13} />
              </div>
            </div>

            <div className="details-row">
              <span>Status</span>
              <div className="relative">
                <button onClick={() => setStatusOpen((v) => !v)} className="status-value">
                  ● {current.status}
                  <ChevronDown size={9} className="inline ml-1" />
                </button>
                {statusOpen && (
                  <div className="figma-popover right-0 top-6 w-36">
                    {statuses.map((item) => (
                      <button
                        key={item}
                        className="menu-check"
                        onClick={() => {
                          setStatusOpen(false);
                          save({ status: item });
                        }}
                      >
                        {item}
                        <span>{current.status === item ? '✓' : ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="details-row">
              <span>Priority</span>
              <div className="relative">
                <button onClick={() => setPriorityOpen((v) => !v)} className="priority-value">
                  ↗ {current.priority}<ChevronDown size={10} />
                </button>
                {priorityOpen && (
                  <div className="figma-popover right-0 top-6 w-36">
                    {priorities.map((item) => (
                      <button
                        key={item}
                        className="menu-check"
                        onClick={() => {
                          setPriorityOpen(false);
                          save({ priority: item });
                        }}
                      >
                        <span>{item}</span>
                        <span>{current.priority === item ? '✓' : ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="details-row">
              <span>Members</span>
              <button className="add-members">
                <Avatar name={current.member} size={18} />
                {current.member}
                <span>＋</span>
              </button>
            </div>

            <div className="details-row">
              <span>Dates</span>
              <div className="relative">
                <button onClick={() => setCalendarOpen((v) => !v)} className="date-range">
                  <CalendarDays size={10} />
                  {startDate}{endDate ? ` → ${endDate}` : ''}
                </button>

                {calendarOpen && (
                  <div className="date-picker">
                    <div className="date-picker-top">
                      <button onClick={() => setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() - 1, 1))}>
                        <ChevronLeft size={13} />
                      </button>
                      <strong>
                        {calendar.toLocaleString('en-US', { month: 'long' })} {calendar.getFullYear()}
                      </strong>
                      <button onClick={() => setCalendar(new Date(calendar.getFullYear(), calendar.getMonth() + 1, 1))}>
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <div className="weekdays">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
                    </div>

                    <div className="days-grid">
                      {days.map((day, index) => (
                        <button key={index} disabled={!day} onClick={() => day && chooseDate(day)} className={day === 10 ? 'today' : ''}>
                          {day || ''}
                        </button>
                      ))}
                    </div>

                    <div className="date-picker-actions">
                      <button onClick={() => { setCalendarOpen(false); setDateStep('start'); }}>Cancel</button>
                      <button onClick={() => setCalendarOpen(false)}>Done</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="details-row">
              <span>Labels</span>
              <div className="detail-label-list">
                {current.labels.map((label) => <span key={label}>{label}</span>)}
              </div>
            </div>

            <div className="details-row">
              <span>Teams</span>
              <span className="muted">—</span>
            </div>

            <div className="details-row">
              <span>Reporter</span>
              <span>{current.reporter || 'Admin'}</span>
            </div>
          </aside>
        </div>

        {/* Updates */}
        <div className="updates-card">
          <div className="section-title">
            <span>⌄ Updates</span>
          </div>
          <div className="update-line">
            <Avatar name="You" size={18} />
            <span>You</span>
            <span className="muted">changed priority from No priority to {current.priority}</span>
          </div>
          <div className="update-line">
            <Avatar name="You" size={18} />
            <span>You</span>
            <span className="muted">posted an update · Aug 2026</span>
          </div>
        </div>
      </section>
    </div>
  );
}
