'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Filter, MoreHorizontal, Plus, Search, X } from 'lucide-react';
import { Project } from '@/types';
import { createProject, deleteProject, updateProject } from '@/lib/api';

const colors = ['#FF5C5C','#FF9F43','#FFC857','#27AE60','#2D9CDB','#7B61FF','#D946EF','#1F2937'];

export function ProjectsPage({ projects, setProjects }: { projects: Project[]; setProjects: (p: Project[]) => void }) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState({ name: '', color: colors[0], description: '' });
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priority, setPriority] = useState('All');
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [field, setField] = useState({ priority: true, lead: true, dueDate: true });

  const rows = useMemo(() => {
    const base = projects.length ? projects : [];
    return base.filter(p => `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()));
  }, [projects, query]);

  const openCreate = () => { setEditing({ id: '', name: '', color: colors[0], description: '' }); setDraft({ name: '', color: colors[0], description: '' }); };
  const openEdit = (p: Project) => { setEditing(p); setDraft({ name: p.name, color: p.color, description: p.description }); };
  const save = async () => {
    if (!draft.name.trim()) return;
    try {
      if (editing?.id) {
        const p = await updateProject(editing.id, draft);
        setProjects(projects.map(x => x.id === p.id ? p : x));
      } else {
        const p = await createProject(draft);
        setProjects([...projects, p]);
      }
      setEditing(null);
    } catch {
      // Keep the workspace usable when the NestJS API is not running.
      // The backend remains the source of truth whenever it is available.
      const localProjects: Project[] = JSON.parse(localStorage.getItem('projects') || '[]');
      if (editing?.id) {
        const p = { ...editing, ...draft };
        const next = localProjects.some(x => x.id === p.id)
          ? localProjects.map(x => x.id === p.id ? p : x)
          : projects.map(x => x.id === p.id ? p : x);
        localStorage.setItem('projects', JSON.stringify(next));
        setProjects(next);
      } else {
        const p: Project = {
          id: `local-${Date.now()}`,
          name: draft.name.trim(),
          color: draft.color,
          description: draft.description,
          lead: 'Admin',
          priority: 'High',
          dueDate: ''
        };
        const next = [...(localProjects.length ? localProjects : projects), p];
        localStorage.setItem('projects', JSON.stringify(next));
        setProjects(next);
      }
      setEditing(null);
    }
  };
  const remove = async (id: string) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
    } catch {
      // Local fallback below keeps delete functional if the API is offline.
    }
    const next = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(next));
    setProjects(next);
  };

  return <div className="projects-page">
    <div className="projects-heading"><h1>Projects</h1><div className="projects-actions">
      <div className="projects-search"><Search size={13}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search"/></div>
      <div className="relative"><button onClick={() => setFieldsOpen(v=>!v)} className="figma-button">▥ Fields</button>{fieldsOpen && <div className="figma-popover right-0 top-10 w-48">{[['priority','Priority'],['lead','Lead'],['dueDate','Due Date']].map(([key,label])=><button key={key} onClick={()=>setField({...field,[key]:!field[key as keyof typeof field]})} className="menu-check"><span>{label}</span><span>{field[key as keyof typeof field]?'✓':''}</span></button>)}</div>}</div>
      <div className="relative"><button onClick={() => setFilterOpen(v=>!v)} className="icon-button"><Filter size={13}/></button>{filterOpen && <div className="figma-popover right-0 top-10 w-56"><div className="menu-title">Priority</div>{['All','Urgent','High','Medium','Low','No Priority'].map(v=><button key={v} onClick={()=>{setPriority(v);setFilterOpen(false)}} className="menu-check"><span>{v}</span><span>{priority===v?'✓':''}</span></button>)}</div>}</div>
      <button onClick={openCreate} className="dark-button"><Plus size={13}/>Add Project</button>
    </div></div>
    <div className="projects-table-wrap"><table className="projects-table"><thead><tr><th>Projects</th>{field.priority&&<th>Priority</th>}{field.lead&&<th>Lead</th>}{field.dueDate&&<th>Due Date</th>}<th>Actions</th></tr></thead><tbody>
      {rows.length ? rows.map((p,i)=><tr key={p.id}><td><button className="project-name" onClick={()=>openEdit(p)}><span className="project-dot" style={{background:p.color}}/>{p.name}</button></td>{field.priority&&<td><span className={`priority-text ${(p.priority || ['High','Low','Medium'][i%3]).toLowerCase().replace(' ','-')}`}>{p.priority || ['High','Low','Medium'][i%3]}</span></td>}{field.lead&&<td><span className="lead-cell"><span className="mini-avatar">{i%2?'CN':'A'}</span>{p.lead || (i%2?'CN':'Admin')}</span></td>}{field.dueDate&&<td>{p.dueDate || ['12 Sep 2026','15 Sep 2026','18 Sep 2026'][i%3]}</td>}<td><div className="row-actions"><button onClick={()=>openEdit(p)}><MoreHorizontal size={14}/></button><button onClick={()=>remove(p.id)} aria-label="Delete project"><X size={13}/></button></div></td></tr>) : <tr><td colSpan={5} className="empty-list">No projects found.</td></tr>}
    </tbody></table><button onClick={openCreate} className="list-add"><Plus size={12}/> Add Projects</button></div>
    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4"><div className="w-full max-w-md rounded-2xl border border-ui panel-ui p-6 shadow-popover"><div className="flex items-center justify-between"><h2 className="font-semibold">{editing.id?'Edit Project':'Add Project'}</h2><button onClick={()=>setEditing(null)}><X size={18}/></button></div><label className="mt-5 block text-xs font-semibold">Project name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} className="mt-2 h-10 w-full rounded-lg border border-ui bg-transparent px-3 outline-none"/></label><label className="mt-4 block text-xs font-semibold">Description<textarea value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})} className="mt-2 h-20 w-full resize-none rounded-lg border border-ui bg-transparent p-3 outline-none"/></label><div className="mt-4 text-xs font-semibold">Project color<div className="mt-3 flex flex-wrap gap-2">{colors.map(c=><button key={c} onClick={()=>setDraft({...draft,color:c})} className={`h-8 w-8 rounded-full border-2 ${draft.color===c?'border-black scale-110':'border-transparent'}`} style={{background:c}}/>)}</div></div><button onClick={save} className="mt-6 w-full rounded-lg bg-[#171717] py-2.5 text-xs font-semibold text-white">Save Project</button></div></div>}
  </div>;
}
