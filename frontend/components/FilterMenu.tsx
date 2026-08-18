'use client';

import { Check, ChevronRight, List, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Priority, Status } from '@/types';

export type Fields = { priority: boolean; members: boolean; dueDate: boolean; labels: boolean; status: boolean; reporter: boolean };
export type FilterState = { status: Status | 'All'; priority: Priority | 'All'; member: string | 'All'; dueDate: string | 'All'; team: string | 'All'; label: string | 'All'; reporter: string | 'All' };

export function FilterMenu({ fields, setFields, view, setView }: { fields: Fields; setFields: (f: Fields) => void; view: 'list'|'board'; setView: (v:'list'|'board') => void }) {
  const [open, setOpen] = useState(false);
  const options: Array<[keyof Fields, string]> = [['priority','Priority'],['members','Members'],['dueDate','Due Date'],['labels','Labels'],['status','Status'],['reporter','Reporter']];
  return <div className="relative"><button onClick={()=>setOpen(!open)} className="figma-button"><span>▥</span> Fields</button>{open&&<div className="figma-popover right-0 top-10 w-[230px]">
    <div className="view-toggle"><button onClick={()=>setView('list')} className={view==='list'?'selected':''}><List size={12}/>List</button><button onClick={()=>setView('board')} className={view==='board'?'selected':''}><SlidersHorizontal size={12}/>Board</button></div>
    {options.map(([key,label])=><button key={key} onClick={()=>setFields({...fields,[key]:!fields[key]})} className="menu-check"><span>{label}</span><span className={`check-box ${fields[key]?'checked':''}`}>{fields[key]&&<Check size={10}/>}</span></button>)}
  </div>}</div>;
}

export function TaskFilterMenu({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const menus: Array<[keyof FilterState, string, string[]]> = [
    ['status','Status',['All','To Do','Doing','Completed','On Hold']],
    ['priority','Priority',['All','No Priority','Urgent','High','Medium','Low']],
    ['member','Members',['All','Admin','CN','Designer','Security','Design']],
    ['dueDate','Due Date',['All','Today','This week','Overdue']],
    ['team','Teams',['All','Design','Engineering','Security']],
    ['label','Labels',['All','Research','Design','Development','Testing','Deployment']],
    ['reporter','Reporter',['All','Admin','Designer']]
  ];
  const active = Object.values(value).filter(v=>v!=='All').length;
  return <div className="relative"><button aria-label="Filters" onClick={()=>{setOpen(v=>!v);setSubmenu(null)}} className={`icon-button ${active?'active-filter':''}`}><SlidersHorizontal size={13}/>{active>0&&<span>{active}</span>}</button>{open&&<div className="figma-popover right-0 top-10 w-[180px] p-1">
    {menus.map(([key,label,values])=><div key={key} className="relative"><button className="nested-menu-item" onMouseEnter={()=>setSubmenu(key)} onClick={()=>setSubmenu(submenu===key?null:key)}><span>{label}</span><ChevronRight size={12}/></button>{submenu===key&&<div className="nested-popover"><div className="menu-title">{label}</div>{values.map(v=><button key={v} className="menu-check" onClick={()=>{onChange({...value,[key]:v} as FilterState);setOpen(false);setSubmenu(null)}}><span>{v}</span><span>{value[key]===v?'✓':''}</span></button>)}</div>}</div>)}
  </div>}</div>;
}
