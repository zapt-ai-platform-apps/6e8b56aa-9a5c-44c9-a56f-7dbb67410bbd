import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function SettingsPage() {
  const [user, setUser] = createSignal(null);
  const [preferences, setPreferences] = createSignal({
    educationLevel: '',
    preferredLanguage: 'English',
    topicsOfInterest: '',
  });
  const navigate = useNavigate();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
      // Load user preferences if stored
    }
  });

  const handleSave = () => {
    // Save preferences logic here
    alert('Preferences saved!');
    navigate('/home');
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div class="max-w-4xl mx-auto">
        <header class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold text-purple-600">Settings</h1>
          <button
            class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer"
            onClick={handleBack}
          >
            Back
          </button>
        </header>

        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="space-y-4">
            <div>
              <label class="block text-gray-700 font-semibold mb-2">
                Education Level
              </label>
              <select
                value={preferences().educationLevel}
                onInput={(e) => setPreferences({ ...preferences(), educationLevel: e.target.value })}
                class="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
              >
                <option value="">Select your education level</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">
                Preferred Language
              </label>
              <select
                value={preferences().preferredLanguage}
                onInput={(e) => setPreferences({ ...preferences(), preferredLanguage: e.target.value })}
                class="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-700 font-semibold mb-2">
                Topics of Interest
              </label>
              <input
                type="text"
                placeholder="E.g., Quantum Mechanics, Algebra, Organic Chemistry"
                value={preferences().topicsOfInterest}
                onInput={(e) => setPreferences({ ...preferences(), topicsOfInterest: e.target.value })}
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none box-border"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;