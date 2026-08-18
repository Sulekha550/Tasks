'use client';

import { ChevronDown, Folder, LayoutGrid, Palette, Search, Settings, SunMoon, UserCircle, X } from 'lucide-react';
import { Project } from '@/types';

export function Sidebar({
  projects, active, onSelect, onProjects, onProfile, mobileOpen, onClose, theme, setTheme, accent, setAccent
}: {
  projects: Project[];
  active: string | null;
  onSelect: (id: string | null) => void;
  onProjects: () => void;
  onProfile: () => void;
  mobileOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (v: 'light' | 'dark') => void;
  accent: string;
  setAccent: (v: string) => void;
}) {
  return (
    <>
      {mobileOpen && <button aria-label="Close menu" onClick={onClose} className="fixed inset-0 z-40 bg-black/30 md:hidden" />}
      <aside className={`workspace-sidebar ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="sidebar-brand">
          <button onClick={onProfile} className="flex items-center gap-2.5 text-left">
            <span className="brand-avatar">D</span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Dexter</span>
          </button>
          <button onClick={onClose} className="rounded-md p-1 md:hidden"><X size={17}/></button>
        </div>

        <div className="sidebar-section-title"><span>Workspace</span><ChevronDown size={14}/></div>
        <nav className="space-y-0.5">
          <button onClick={() => { onSelect(null); onClose(); }} className={`sidebar-nav-item ${active === null ? 'active' : ''}`}><LayoutGrid size={16} strokeWidth={1.9}/>Tasks</button>
          <button onClick={() => { onProjects(); onClose(); }} className="sidebar-nav-item"><Folder size={16} strokeWidth={1.9}/>Projects</button>
        </nav>

        <div className="sidebar-projects">
          <div className="sidebar-section-title muted"><span className="flex items-center gap-2"><Palette size={13}/>Projects</span></div>
          <div className="space-y-0.5">
            {projects.map((p) => <button key={p.id} onClick={() => { onSelect(p.id); onClose(); }} className={`sidebar-project-item ${active === p.id ? 'active' : ''}`}><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.color }}/><span className="truncate">{p.name}</span></button>)}
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-menu-item"><Search size={14}/>Search</button>
          <button onClick={() => { onProfile(); onClose(); }} className="sidebar-menu-item"><UserCircle size={14}/>Profile</button>
          <div className="sidebar-menu-group">
            <div className="sidebar-menu-label"><SunMoon size={14}/>Theme</div>
            <button onClick={() => setTheme('light')} className="sidebar-submenu-item">Light {theme === 'light' && <span>✓</span>}</button>
            <button onClick={() => setTheme('dark')} className="sidebar-submenu-item">Dark {theme === 'dark' && <span>✓</span>}</button>
          </div>
          <div className="sidebar-menu-group">
            <div className="sidebar-menu-label"><Palette size={14}/>Color</div>
            {['Amber','Blue','Pink','Rose','Emerald','Black'].map((name) => <button key={name} onClick={() => setAccent(name.toLowerCase())} className="sidebar-submenu-item"><span className={`color-dot color-${name.toLowerCase()}`}/>{name}{accent === name.toLowerCase() && <span>✓</span>}</button>)}
          </div>
          <button className="sidebar-menu-item"><Settings size={14}/>Settings</button>
        </div>
      </aside>
    </>
  );
}
