import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusPill from '../components/StatusPill';
import { listTasks, createTask, runTask } from '../api/tasks';

const OPERATIONS = [
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'reverse', label: 'Reverse string' },
  { value: 'wordcount', label: 'Word count' },
];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [title, setTitle] = useState('');
  const [inputText, setInputText] = useState('');
  const [operationType, setOperationType] = useState('uppercase');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    try {
      const data = await listTasks();
      setTasks(data);
    } catch {
      // silent - polling will retry
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    // Poll every 2s so Pending/Running tasks update to Success/Failed without manual refresh
    const interval = setInterval(fetchTasks, 2000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !inputText.trim()) {
      setError('Title and input text are required.');
      return;
    }
    setCreating(true);
    try {
      const task = await createTask({ title, inputText, operationType });
      setTasks((prev) => [task, ...prev]);
      await runTask(task._id);
      setTitle('');
      setInputText('');
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen " >
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-ink">New task</h1>
          <p className="mt-1 text-sm text-faint">
            Submit text for asynchronous processing. It runs through the queue and worker automatically.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-12 grid grid-cols-1 gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-2"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-faint">Task title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Normalize customer name"
              className="w-full rounded-lg border border-border bg-raised px-3 py-2 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-faint">Operation</label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value)}
              className="w-full rounded-lg border border-border bg-raised px-3 py-2 text-sm text-ink outline-none transition focus:border-accent"
            >
              {OPERATIONS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-medium text-faint">Input text</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
              placeholder="Paste the text you want processed..."
              className="w-full rounded-lg border border-border bg-raised px-3 py-2 text-sm text-ink outline-none transition focus:border-accent"
            />
          </div>

          {error && (
            <p className="md:col-span-2 rounded-md border border-failed/30 bg-failed/10 px-3 py-2 text-xs text-failed">
              {error}
            </p>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-base transition hover:bg-accent-dim disabled:opacity-50"
            >
              {creating ? 'Queuing...' : 'Run task'}
            </button>
          </div>
        </form>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-ink">Your tasks</h2>
          <span className="font-mono text-xs text-faint">{tasks.length} total</span>
        </div>

        {loadingTasks ? (
          <p className="font-mono text-sm text-faint">loading...</p>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="text-sm text-faint">No tasks yet. Create one above to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-4 transition hover:border-accent/40"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{task.title}</p>
                  <p className="mt-1 font-mono text-xs text-faint">
                    {task.operationType} · {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <StatusPill status={task.status} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;