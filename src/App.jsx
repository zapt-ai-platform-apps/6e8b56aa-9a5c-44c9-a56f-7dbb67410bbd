import { createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route, useNavigate } from '@solidjs/router';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/home');
      } else {
        setUser(null);
        navigate('/login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  return (
    <div class="min-h-screen h-full">
      <Routes>
        <Route path="/login" component={AuthPage} />
        <Route path="/home" component={HomePage} />
        <Route path="/settings" component={SettingsPage} />
      </Routes>
    </div>
  );
}

export default App;