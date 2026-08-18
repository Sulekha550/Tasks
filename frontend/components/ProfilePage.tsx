'use client';

import { ChevronLeft, Pencil, UserCircle } from 'lucide-react';

export function ProfilePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="profile-page">
      <button onClick={onBack} className="profile-back"><ChevronLeft size={15}/> Back to app</button>
      <div className="profile-wrap">
        <h1>Profile</h1>
        <section className="profile-card">
          <div className="profile-row"><div className="profile-label">Profile picture</div><div className="profile-avatar">D</div></div>
          <div className="profile-row"><div><div className="profile-label">Email</div></div><div className="profile-value editable">dexter@gmail.com <Pencil size={12}/></div></div>
          <div className="profile-row"><div><div className="profile-label">Full name</div></div><div className="profile-input">Dexter</div></div>
          <div className="profile-row"><div><div className="profile-label">Title</div><div className="profile-help">Your job title or role</div></div><div className="profile-input">Designer</div></div>
          <div className="profile-row"><div><div className="profile-label">Username</div><div className="profile-help">One word, like a nickname or first name</div></div><div className="profile-input">Dexuser</div></div>
        </section>
        <h2>Workspace access</h2>
        <section className="workspace-access"><span>Remove yourself from the workspace</span><button>Leave Workspace</button></section>
      </div>
    </div>
  );
}
