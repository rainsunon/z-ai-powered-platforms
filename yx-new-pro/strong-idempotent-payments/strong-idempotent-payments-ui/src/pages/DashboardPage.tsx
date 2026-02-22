export default function DashboardPage() {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-text mb-2">Dashboard</h2>
      <p className="text-text-muted leading-relaxed max-w-2xl">
        This UI is built for the Strong Idempotent Payments API. The backend guarantees "exactly-once
        business effect" for charges by persisting an idempotency key + request hash + stored response.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {/* Card 1 */}
        <div className="glass-card p-6 hover:border-primary/50 transition-colors duration-300">
          <h3 className="text-lg font-bold text-text mb-3 flex items-center gap-2">
            <span className="inline-flex w-8 h-8 rounded-lg bg-primary/15 items-center justify-center text-primary-light text-sm">🔒</span>
            How idempotency works
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            Send <code className="text-primary-light bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono">X-Idempotency-Key</code> with
            your charge request. On retries/timeouts/double clicks, the backend replays the stored response
            and returns the same result.
          </p>
          <p className="text-sm text-text-muted leading-relaxed mt-3">
            If the same key is reused with a different payload, the backend returns{' '}
            <span className="chip text-xs">409 CONFLICT</span>.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-card p-6 hover:border-accent/50 transition-colors duration-300">
          <h3 className="text-lg font-bold text-text mb-3 flex items-center gap-2">
            <span className="inline-flex w-8 h-8 rounded-lg bg-accent/15 items-center justify-center text-accent text-sm">🧪</span>
            What to try
          </h3>
          <ol className="space-y-2 text-sm text-text-muted leading-relaxed list-decimal list-inside">
            <li>
              Go to <strong className="text-text">New Charge</strong>, generate a key, submit.
            </li>
            <li>
              Click <strong className="text-text">Replay</strong> with the same key: response should be
              identical and marked as replayed.
            </li>
            <li>
              Change the amount but keep the same key: you should get 409 conflict.
            </li>
          </ol>
        </div>
      </div>

      {/* Quick stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Request Hash', value: 'SHA-256', icon: '#️⃣' },
          { label: 'Lock Strategy', value: 'PG Advisory', icon: '🔐' },
          { label: 'Outbox', value: 'Kafka', icon: '📤' },
          { label: 'Cache', value: 'Redis', icon: '⚡' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-4 text-center hover:border-primary/40 transition-all duration-300 group"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
              {stat.icon}
            </div>
            <p className="text-xs text-text-dim uppercase tracking-widest font-medium">{stat.label}</p>
            <p className="text-sm font-bold text-text mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
