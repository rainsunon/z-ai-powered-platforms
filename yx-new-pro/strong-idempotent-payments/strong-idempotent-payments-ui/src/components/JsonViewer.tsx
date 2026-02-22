/**
 * Simple JSON pretty printer component – Tailwind styled.
 */
export function JsonViewer(props: { title?: string; value: unknown }) {
  return (
    <div className="mt-4 animate-fade-in-up">
      {props.title ? (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
          {props.title}
        </h4>
      ) : null}
      <pre className="p-4 rounded-lg border border-border bg-bg text-[13px] leading-relaxed overflow-auto text-text-muted whitespace-pre-wrap break-words max-h-96">
        {JSON.stringify(props.value, null, 2)}
      </pre>
    </div>
  );
}
