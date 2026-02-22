import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchPayment, resetLookup } from '../store/paymentLookupSlice';
import { JsonViewer } from '../components/JsonViewer';

export default function PaymentLookupPage() {
  const dispatch = useAppDispatch();
  const { loading, data, error } = useAppSelector((s) => s.paymentLookup);
  const [paymentId, setPaymentId] = useState('');

  const onSearch = () => {
    const id = paymentId.trim();
    if (!id) return;
    dispatch(resetLookup());
    dispatch(fetchPayment(id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-text mb-5">Lookup Payment</h2>

      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            className="form-input flex-1"
            placeholder="Enter Payment ID"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary"
            onClick={onSearch}
            disabled={!paymentId.trim() || loading}
          >
            {loading ? 'Fetching…' : 'Fetch'}
          </button>
        </div>

        {loading && (
          <p className="text-sm text-text-muted mt-4 animate-pulse">Loading…</p>
        )}

        {data && <JsonViewer title="Payment" value={data} />}

        {error && <JsonViewer title="Error" value={error} />}

        {!data && !error && !loading && paymentId.trim() && (
          <p className="text-sm text-text-dim mt-4">Enter a Payment ID and click Fetch.</p>
        )}
      </div>
    </div>
  );
}
