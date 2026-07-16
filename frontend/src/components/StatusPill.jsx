const STATUS_STYLES = {
  Pending: { dot: 'bg-amber-400', text: 'text-amber-400', label: 'pending' },
  Running: { dot: 'bg-blue-400', text: 'text-blue-400', label: 'running' },
  Success: { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'success' },
  Failed: { dot: 'bg-red-400', text: 'text-red-400', label: 'failed' },
};

function StatusPill({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const isActive = status === 'Pending' || status === 'Running';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1 font-mono text-xs ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot} ${isActive ? 'animate-pulse' : ''}`} />
      {style.label}
    </span>
  );
}

export default StatusPill;