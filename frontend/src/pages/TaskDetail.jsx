import { useEffect, useState, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusPill from '../components/StatusPill';
import { getTask } from '../api/tasks';

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTask = useCallback(async () => {
    try {
      const data = await getTask(id);
      setTask(data);
    } catch (err) {
      setError('Could not load this task.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
    const interval = setInterval(() => {
      if (task && (task.status === 'Success' || task.status === 'Failed')) {
        clearInterval(interval);
        return;
      }
      fetchTask();
    }, 1400);

    return () => clearInterval(interval);
  }, [fetchTask, task]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading task details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-white mb-3">Task Not Found</h2>
          <p className="text-slate-400 mb-8">{error || 'The requested task could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = task.status === 'Success' || task.status === 'Failed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-12">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 group"
        >
          ← <span className="group-hover:underline">Back to all tasks</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{task.title}</h1>
            <p className="mt-2 font-mono text-sm text-slate-500">
              {task.operationType} • {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusPill status={task.status} />
        </div>

        {/* Input Section */}
        <div className="mb-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 backdrop-blur p-7">
          <h3 className="uppercase tracking-widest text-xs font-medium text-slate-500 mb-4">INPUT</h3>
          <div className="bg-slate-950 rounded-2xl p-6 font-mono text-slate-300 whitespace-pre-wrap border border-slate-800">
            {task.inputText}
          </div>
        </div>

        {/* Result Section */}
        <div className="mb-8 rounded-3xl border border-slate-700/70 bg-slate-900/60 backdrop-blur p-7">
          <h3 className="uppercase tracking-widest text-xs font-medium text-slate-500 mb-4">RESULT</h3>
          {task.result ? (
            <div className="bg-emerald-950/50 border border-emerald-900 rounded-2xl p-6 font-mono text-emerald-300 whitespace-pre-wrap">
              {task.result}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              {task.status === 'Failed' ? 'No result — processing failed.' : 'Waiting for worker to complete...'}
            </div>
          )}
        </div>

        {/* Logs Section */}
        <div className="rounded-3xl border border-slate-700/70 bg-slate-900/60 backdrop-blur p-7">
          <h3 className="uppercase tracking-widest text-xs font-medium text-slate-500 mb-5">EXECUTION LOGS</h3>
          
          <div className="bg-slate-950 rounded-2xl p-6 max-h-96 overflow-y-auto font-mono text-xs space-y-2 border border-slate-800">
            {task.logs && task.logs.length > 0 ? (
              task.logs.map((log, idx) => (
                <div key={idx} className="text-slate-400">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-slate-500 italic">No logs available yet...</p>
            )}
          </div>
        </div>

        {isComplete && (
          <div className="mt-8 text-center">
            <p className="text-emerald-400 text-sm font-medium">✓ Task Completed</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default TaskDetail;