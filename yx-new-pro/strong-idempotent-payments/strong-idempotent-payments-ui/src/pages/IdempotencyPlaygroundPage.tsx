import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateIdempotencyKey } from '../shared/utils/idempotency';
import type { ChargeRequest, ChargeResult, ApiProblem } from '../shared/types/payments';
import { useAppDispatch } from '../store/store';
import { submitCharge } from '../store/chargeSlice';
import { JsonViewer } from '../components/JsonViewer';

const schema = z.object({
  idempotencyKey: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[A-Za-z0-9._:-]+$/),
  customerId: z.string().min(1),
  amount: z.coerce.number().int().positive(),
  currency: z.string().min(1),
  paymentMethodToken: z.string().min(1),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/**
 * Playground page — intentionally explicit so users can tweak payload/key
 * to observe backend behavior (201 created, replay, or 409 conflict).
 */
export default function IdempotencyPlaygroundPage() {
  const dispatch = useAppDispatch();
  const [result, setResult] = useState<ChargeResult | null>(null);
  const [error, setError] = useState<ApiProblem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      idempotencyKey: generateIdempotencyKey(),
      customerId: 'cust_123',
      amount: 1999,
      currency: 'USD',
      paymentMethodToken: 'pm_tok_test_visa',
      description: 'Playground charge',
    },
  });

  const onSubmit = form.handleSubmit(async (v) => {
    setError(null);
    setResult(null);

    const payload: ChargeRequest = {
      customerId: v.customerId,
      amount: v.amount,
      currency: v.currency,
      paymentMethodToken: v.paymentMethodToken,
      description: v.description || undefined,
    };

    setSubmitting(true);
    const action = await dispatch(submitCharge({ idempotencyKey: v.idempotencyKey, payload }));
    setSubmitting(false);
    if (submitCharge.fulfilled.match(action)) {
      setResult(action.payload);
    } else {
      setError((action.payload as ApiProblem) ?? { message: 'Unexpected error' });
    }
  });

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-text mb-5">Idempotency Playground</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Form Card ─── */}
        <div className="glass-card p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Idempotency Key */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                X-Idempotency-Key
              </label>
              <div className="flex gap-2">
                <input
                  className="form-input flex-1"
                  {...form.register('idempotencyKey')}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => form.setValue('idempotencyKey', generateIdempotencyKey())}
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-text-dim mt-1">
                Reuse the same key to replay. Reuse with different payload to trigger 409.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Customer ID
              </label>
              <input className="form-input" {...form.register('customerId')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Amount (minor units)
                </label>
                <input type="number" className="form-input" {...form.register('amount')} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <input className="form-input" {...form.register('currency')} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Payment Method Token
              </label>
              <input className="form-input" {...form.register('paymentMethodToken')} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Description
              </label>
              <input className="form-input" {...form.register('description')} />
            </div>

            <hr className="border-border" />

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send request'}
            </button>
          </form>
        </div>

        {/* ─── Output Card ─── */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-text mb-3">Output</h3>

          {result && (
            <>
              <JsonViewer
                title="Headers summary"
                value={{
                  httpStatus: result.status,
                  replayed: result.replayed,
                  idempotencyKey: result.idempotencyKey,
                  requestHash: result.requestHash,
                }}
              />
              <JsonViewer title="Body" value={result.body} />
            </>
          )}

          {error && <JsonViewer title="Error" value={error} />}

          {!result && !error && (
            <p className="text-sm text-text-dim mt-4">Submit a request to see output.</p>
          )}
        </div>
      </div>
    </div>
  );
}
