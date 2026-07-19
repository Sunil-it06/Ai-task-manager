function StatusPill({ status }) {
  const statusConfig = {
    Pending: {
      label: 'PENDING',
      color: 'amber',
      dotColor: 'bg-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-400/30',
      pulse: true,
    },
    Running: {
      label: 'RUNNING',
      color: 'blue',
      dotColor: 'bg-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-400/30',
      pulse: true,
    },
    Success: {
      label: 'SUCCESS',
      color: 'emerald',
      dotColor: 'bg-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-400/30',
      pulse: false,
    },
    Failed: {
      label: 'FAILED',
      color: 'red',
      dotColor: 'bg-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-400/30',
      pulse: false,
    },
  };

  const config = statusConfig[status] || statusConfig.Pending;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-mono font-medium tracking-widest transition-all duration-300 ${config.bgColor} ${config.borderColor} ${config.text || `text-${config.color}-400`}`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${config.dotColor} ${config.pulse ? 'animate-pulse' : ''}`}
      />
      {config.label}
    </span>
  );
}

export default StatusPill;