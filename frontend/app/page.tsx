'use client';

import { useEffect, useState } from 'react';
import { Chrome } from 'lucide-react';
import { TasksPage } from '@/components/TasksPage';
import { guestLogin } from '@/lib/api';

export default function Home() {
  const [logged, setLogged] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    setLogged(localStorage.getItem('guest') === '1');
  }, []);

  const continueAsGuest = async () => {
    try {
      const result = await guestLogin();
      localStorage.setItem('guest', '1');
      localStorage.setItem('guestUser', JSON.stringify(result.user));
      setLogged(true);
    } catch {
      // Keep guest login usable if the API is temporarily unavailable.
      localStorage.setItem('guest', '1');
      setLogged(true);
    }
  };

  if (!ready) return <div className="min-h-screen bg-white" />;
  if (logged) return <TasksPage />;

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Login">
        <h1>Let&apos;s get back on track</h1>
        <p>Enter your email below to login to your account.</p>

        <button onClick={continueAsGuest} className="guest-button">
          Continue as Guest
        </button>

        <button className="google-button" type="button">
          <Chrome size={16} strokeWidth={2.2} />
          <span>Login with Google</span>
        </button>

        <p className="login-terms">
          By clicking continue, you agree to<br />
          our <u>Terms of Service</u> and <u>Privacy Policy</u>
        </p>
      </section>
    </main>
  );
}
