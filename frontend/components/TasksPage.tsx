'use client';

import { useEffect, useMemo, useState } from 'react';
import { Ellipsis, Menu, Moon, Plus, Search, Sun } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TaskCard } from './TaskCard';
import { TaskDetail } from './TaskDetail';
import { FilterMenu, Fields, FilterState, TaskFilterMenu } from './FilterMenu';
import { ProjectsPage } from './ProjectsPage';
import { ProfilePage } from './ProfilePage';
import { Project, Status, Task } from '@/types';
import { TaskListView } from './TaskListView';
import { createTask, getProjects, getTasks } from '@/lib/api';

const statuses: Status[] = ['To Do', 'Doing', 'Completed', 'On Hold'];
const initialFilter: FilterState = { status:'All', priority:'All', member:'All', dueDate:'All', team:'All', label:'All', reporter:'All' };

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [screen, setScreen] = useState<'tasks' | 'projects' | 'profile' | 'detail'>('tasks');
  const [view, setView] = useState<'board' | 'list'>('board');
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [accent, setAccent] = useState('black');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fields, setFields] = useState<Fields>({ priority: true, members: true, dueDate: true, labels: false, status: false, reporter: false });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(initialFilter);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAccent = localStorage.getItem('accent');
    if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
    if (savedAccent) setAccent(savedAccent);
    Promise.all([getTasks(), getProjects()])
      .then(([t, p]) => {
        setTasks(t);
        setProjects(p);
      })
      .catch(() => {
        // The UI can still be used locally when the API is temporarily unavailable.
        try {
          const localTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
          const localProjects = JSON.parse(localStorage.getItem('projects') || '[]');
          setTasks(Array.isArray(localTasks) ? localTasks : []);
          setProjects(Array.isArray(localProjects) ? localProjects : []);
        } catch {
          setTasks([]);
          setProjects([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { document.documentElement.dataset.accent = accent; localStorage.setItem('accent', accent); }, [accent]);

  const filtered = useMemo(() => tasks.filter(t => {
    const matchesQuery = !query || `${t.title} ${t.description || ''} ${t.member} ${t.reporter || ''} ${t.labels.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesProject = !projectFilter || t.projectId === projectFilter;
    const matchesStatus = filters.status === 'All' || t.status === filters.status;
    const matchesPriority = filters.priority === 'All' || t.priority === filters.priority;
    const matchesMember = filters.member === 'All' || t.member === filters.member;
    const matchesLabel = filters.label === 'All' || t.labels.includes(filters.label);
    const matchesReporter = filters.reporter === 'All' || t.reporter === filters.reporter;
    return matchesQuery && matchesProject && matchesStatus && matchesPriority && matchesMember && matchesLabel && matchesReporter;
  }), [tasks, projectFilter, query, filters]);

  const add = async (status: Status = 'To Do') => {
    const p = projectFilter || projects[0]?.id || '';
    if (!p) return;
    try {
      const task = await createTask({ title:'New Task', description:'', status, priority:'No Priority', member:'Admin', reporter:'Admin', dueDate:'', labels:['Deployment'], projectId:p, subtasks:[], comments:[] });
      setTasks(x => [task, ...x]);
      setSelectedTask(task);
    } catch {
      const task: Task = {
        id: `local-task-${Date.now()}`,
        title: 'New Task',
        description: '',
        status,
        priority: 'No Priority',
        member: 'Admin',
        reporter: 'Admin',
        dueDate: '',
        labels: ['Deployment'],
        projectId: p,
        subtasks: [],
        comments: []
      };
      const next = [task, ...tasks];
      localStorage.setItem('tasks', JSON.stringify(next));
      setTasks(next);
      setSelectedTask(task);
    }
  };

  const projectName = projects.find(p => p.id === projectFilter)?.name;
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm muted">Loading workspace...</div>;

  return <div className="app-shell flex min-h-screen">
    <Sidebar projects={projects} active={projectFilter} onSelect={id=>{setProjectFilter(id);setScreen('tasks')}} onProjects={()=>setScreen('projects')} onProfile={()=>setScreen('profile')} mobileOpen={mobileOpen} onClose={()=>setMobileOpen(false)} theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent}/>
    <main className="min-w-0 flex-1">
      <header className="tasks-header flex items-center px-6 max-md:px-4">
        <button aria-label="Open menu" className="rounded-lg p-2 md:hidden" onClick={()=>setMobileOpen(true)}><Menu size={18}/></button>
        <div className="hidden text-[10px] muted md:block">{screen==='projects'?'Projects':screen==='profile'?'Profile':<>Projects <span className="px-1">›</span> {projectName || 'Tasks'}</>}</div>
        <div className="ml-auto flex items-center gap-1.5"><button aria-label="Toggle theme" onClick={()=>setTheme(theme==='light'?'dark':'light')} className="rounded-lg p-2 hover:soft-ui">{theme==='light'?<Moon size={15}/>:<Sun size={15}/>}</button><button onClick={()=>{localStorage.removeItem('guest');location.reload()}} className="rounded-lg border border-ui px-3 py-1.5 text-[10px] font-medium">Log out</button></div>
      </header>

      {screen==='projects' ? <ProjectsPage projects={projects} setProjects={setProjects}/> : screen==='profile' ? <ProfilePage onBack={()=>setScreen('tasks')}/> : screen==='detail' && selectedTask ? <TaskDetail task={selectedTask} mode="page" projectName={projectName} onClose={()=>{setSelectedTask(null);setScreen('tasks')}} onSaved={t=>{setTasks(x=>x.map(a=>a.id===t.id?t:a));setSelectedTask(t)}} onDeleted={id=>{setTasks(x=>x.filter(t=>t.id!==id));setSelectedTask(null);setScreen('tasks')}}/> : <div className="p-6 max-md:p-4 lg:p-7">
        <div className="tasks-toolbar mb-5"><div className="tasks-heading"><h1>Tasks</h1><span>{filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}</span></div><div className="tasks-toolbar-actions"><div className="projects-search max-w-[200px]"><Search size={13}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search"/></div><FilterMenu fields={fields} setFields={setFields} view={view} setView={setView}/><TaskFilterMenu value={filters} onChange={setFilters}/><button onClick={()=>add()} className="dark-button"><Plus size={13}/>Add Task</button></div></div>
        {view==='board' ? <div className="mobile-scroll pb-2"><div className="tasks-board-grid grid min-w-[850px] grid-cols-4 gap-3">{statuses.map(status=><section key={status} className="board-column"><div className="board-column-title"><span>{status}</span><div className="flex items-center gap-0.5"><button onClick={()=>add(status)} aria-label={`Add task to ${status}`} className="rounded p-1 text-sm muted hover:soft-ui">+</button><button aria-label={`${status} options`} className="rounded p-1 muted hover:soft-ui"><Ellipsis size={13}/></button></div></div><div className="space-y-2">{filtered.filter(t=>t.status===status).map(t=><TaskCard key={t.id} task={t} onOpen={task=>{setSelectedTask(task);setScreen('detail')}}/>)}</div><button onClick={()=>add(status)} className="board-add">+ Add Task</button></section>)}</div></div> : <TaskListView tasks={filtered} fields={fields} onOpen={task=>{setSelectedTask(task);setScreen('detail')}} onAdd={add}/>} 
      </div>}
      {selectedTask && screen==='tasks' && <TaskDetail task={selectedTask} onClose={()=>setSelectedTask(null)} onSaved={t=>{setTasks(x=>x.map(a=>a.id===t.id?t:a));setSelectedTask(t)}} onDeleted={id=>{setTasks(x=>x.filter(t=>t.id!==id));setSelectedTask(null)}}/>}
    </main>
  </div>;
}
