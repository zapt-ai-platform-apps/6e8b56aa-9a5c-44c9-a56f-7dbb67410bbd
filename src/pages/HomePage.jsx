import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase, createEvent } from '../supabaseClient';
import { SolidMarkdown } from 'solid-markdown';
import { Show, For } from 'solid-js/web';

function HomePage() {
  const [user, setUser] = createSignal(null);
  const [subject, setSubject] = createSignal('Physics');
  const [inputText, setInputText] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [messages, setMessages] = createSignal([]);
  const navigate = useNavigate();

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const handleSend = async () => {
    if (!inputText()) return;
    setLoading(true);
    const newMessage = { role: 'user', content: inputText() };
    setMessages([...messages(), newMessage]);
    setInputText('');

    try {
      const result = await createEvent('chatgpt_request', {
        prompt: `As an expert in ${subject()}, help me with the following question: ${newMessage.content}`,
        response_type: 'text'
      });
      const aiMessage = { role: 'assistant', content: result };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div class="max-w-4xl mx-auto flex flex-col h-full">
        <header class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold text-purple-600">AI Study Assistant</h1>
          <div class="flex space-x-4">
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer"
              onClick={() => navigate('/settings')}
            >
              Settings
            </button>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto mb-4">
          <div class="bg-white p-4 rounded-lg shadow-md h-full">
            <For each={messages()}>
              {(message) => (
                <div class={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <p class={`inline-block px-4 py-2 rounded-lg ${
                    message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}>
                    <SolidMarkdown children={message.content} />
                  </p>
                </div>
              )}
            </For>
            <Show when={loading()}>
              <div class="text-center text-gray-500">Loading...</div>
            </Show>
          </div>
        </main>

        <footer class="mt-4">
          <div class="flex items-center space-x-4">
            <select
              value={subject()}
              onInput={(e) => setSubject(e.target.value)}
              class="p-2 bg-white border border-gray-300 rounded-md cursor-pointer"
            >
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
            <input
              type="text"
              placeholder="Type your question..."
              value={inputText()}
              onInput={(e) => setInputText(e.target.value)}
              class="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none box-border"
            />
            <button
              onClick={handleSend}
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full shadow-md cursor-pointer"
              disabled={loading()}
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;