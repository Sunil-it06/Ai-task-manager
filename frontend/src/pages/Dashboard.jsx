import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusPill from '../components/StatusPill';
import { listTasks, createTask, runTask } from '../api/tasks';

const OPERATIONS = [
  { value: 'uppercase', label: 'Uppercase', icon: '↑' },
  { value: 'lowercase', label: 'Lowercase', icon: '↓' },
  { value: 'reverse', label: 'Reverse', icon: '↔' },
  { value: 'wordcount', label: 'Word Count', icon: '#️⃣' },
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 1800);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    if (!title.trim() || !inputText.trim()) {
      setError('Please fill both title and input text.');
      return;
    }

    setCreating(true);
    try {
      const task = await createTask({ title, inputText, operationType });
      await runTask(task._id);
      setTitle('');
      setInputText('');
      fetchTasks(); // Refresh immediately
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">TaskFlow</h1>
            <p className="mt-2 text-lg text-slate-400">
              Process text asynchronously with intelligent workers
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Live Queue</p>
            <p className="text-2xl font-mono font-semibold text-emerald-400">{tasks.length}</p>
          </div>
        </div>

        {/* Create Task Card - Modern Glassmorphism */}
        <div className="mb-12 rounded-3xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">
          <h2 className="mb-6 text-2xl font-semibold text-white">Create New Task</h2>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Process customer feedback"
                  className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-5 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Operation Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {OPERATIONS.map((op) => (
                    <button
                      key={op.value}
                      type="button"
                      onClick={() => setOperationType(op.value)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                        operationType === op.value
                          ? 'border-emerald-500 bg-emerald-500/10 text-white'
                          : 'border-slate-700 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <span className="text-xl">{op.icon}</span>
                      <span className="font-medium">{op.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Input Text</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="Paste or type the text you want to process..."
                className="w-full resize-y min-h-[140px] rounded-3xl bg-slate-800 border border-slate-700 px-5 py-4 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
              />
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={creating || !title.trim() || !inputText.trim()}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-white font-semibold rounded-2xl text-lg transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/30"
            >
              {creating ? 'Queuing Task...' : '🚀 Submit to Queue'}
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Recent Tasks</h2>
          <span className="text-slate-400 text-sm font-mono">{tasks.length} tasks</span>
        </div>

        {loadingTasks ? (
          <div className="text-center py-20 text-slate-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-700 py-20 text-center">
            <p className="text-slate-400">No tasks yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="group block rounded-3xl border border-slate-700 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/30 transition-all duration-300 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-white truncate group-hover:text-emerald-400 transition-colors">
                      {task.title}
                    </p>
                    <p className="mt-2 font-mono text-sm text-slate-500">
                      {task.operationType} • {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <StatusPill status={task.status} />
                </div>

                {task.result && (
                  <div className="mt-4 text-sm text-emerald-400 font-mono line-clamp-2">
                    Result: {task.result}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;