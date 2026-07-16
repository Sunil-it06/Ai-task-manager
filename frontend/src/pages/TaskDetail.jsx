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
    } catch {
      setError('Could not load this task.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
    const interval = setInterval(() => {
      // Stop polling once the task has reached a terminal state
      setTask((current) => {
        if (current && (current.status === 'Success' || current.status === 'Failed')) {
          clearInterval(interval);
        }
        return current;
      });
      fetchTask();
    }, 1500);
    return () => clearInterval(interval);
  }, [fetchTask]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <p className="mx-auto max-w-3xl px-6 py-10 font-mono text-sm text-faint">loading...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-sm text-failed">{error || 'Task not found.'}</p>
          <Link to="/" className="mt-4 inline-block text-sm text-accent hover:underline">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/" className="mb-6 inline-block text-sm text-faint hover:text-accent">
          ← Back to dashboard
        </Link>

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-ink">{task.title}</h1>
            <p className="mt-1 font-mono text-xs text-faint">
              {task.operationType} · id {task._id}
            </p>
          </div>
          <StatusPill status={task.status} />
        </div>

        <section className="mb-5 rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Input</h2>
          <p className="whitespace-pre-wrap font-mono text-sm text-ink">{task.inputText}</p>
        </section>

        <section className="mb-5 rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Result</h2>
          {task.result ? (
            <p className="whitespace-pre-wrap font-mono text-sm text-success">{task.result}</p>
          ) : (
            <p className="font-mono text-sm text-faint">
              {task.status === 'Failed' ? 'No result — task failed.' : 'Waiting for worker...'}
            </p>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">Execution logs</h2>
          <div className="space-y-1.5">
            {task.logs.length === 0 ? (
              <p className="font-mono text-xs text-faint">No logs yet.</p>
            ) : (
              task.logs.map((log, idx) => (
                <p key={idx} className="font-mono text-xs text-faint">
                  {log}
                </p>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default TaskDetail;