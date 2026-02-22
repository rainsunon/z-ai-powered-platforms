import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../store/store';
import { submitCharge } from '../store/chargeSlice';
import { showToast } from '../store/toastSlice';
import type { ChargeRequest } from '../shared/types/payments';
import { generateIdempotencyKey } from '../shared/utils/idempotency';
import { JsonViewer } from '../components/JsonViewer';

const schema = z.object({
  idempotencyKey: z
    .string()
    .min(1, 'Required')
    .max(128, 'Max 128 chars')
    .regex(/^[A-Za-z0-9._:-]+$/, 'Allowed: A-Z a-z 0-9 . _ : -'),
  customerId: z.string().min(1, 'Required'),
  amount: z.coerce.number().int().positive('Must be positive'),
  currency: z.string().min(1, 'Required'),
  paymentMethodToken: z.string().min(1, 'Required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  idempotencyKey: generateIdempotencyKey(),
  customerId: 'cust_123',
  amount: 1999,
  currency: 'USD',
  paymentMethodToken: 'pm_tok_test_visa',
  description: 'Test charge from UI',
};

export default function ChargePage() {
  const dispatch = useAppDispatch();
  const { loading, lastResult, lastKey, lastPayload } = useAppSelector((s) => s.charge);

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const errors = form.formState.errors;
  const canReplay = Boolean(lastKey && lastPayload && lastResult);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: ChargeRequest = {
      customerId: values.customerId,
      amount: values.amount,
      currency: values.currency,
      paymentMethodToken: values.paymentMethodToken,
      description: values.description || undefined,
    };

    const action = await dispatch(submitCharge({ idempotencyKey: values.idempotencyKey, payload }));
    if (submitCharge.fulfilled.match(action)) {
      dispatch(
        showToast({
          severity: 'success',
          message: action.payload.replayed
            ? 'Charge replayed successfully'
            : 'Charge created successfully',
        }),
      );
    } else {
      const errPayload = action.payload as { status?: number; message?: string } | undefined;
      dispatch(
        showToast({
          severity: 'error',
          message: `${errPayload?.status ?? 500} ${errPayload?.message ?? 'Request failed'}`,
        }),
      );
    }
  });

  const replay = async () => {
    if (!lastKey || !lastPayload) return;
    form.setValue('idempotencyKey', lastKey);
    const action = await dispatch(submitCharge({ idempotencyKey: lastKey, payload: lastPayload }));
    if (submitCharge.fulfilled.match(action)) {
      dispatch(showToast({ severity: 'info', message: 'Replay request completed' }));
    } else {
      const errPayload = action.payload as { status?: number; message?: string } | undefined;
      dispatch(
        showToast({
          severity: 'error',
          message: `${errPayload?.status ?? 500} ${errPayload?.message ?? 'Replay failed'}`,
        }),
      );
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-3xl font-extrabold text-text mb-5">New Charge</h2>

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
                  className={`form-input flex-1 ${errors.idempotencyKey ? 'border-error' : ''}`}
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
              {errors.idempotencyKey && (
                <p className="text-xs text-error mt-1">{errors.idempotencyKey.message}</p>
              )}
            </div>

            {/* Customer ID */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Customer ID
              </label>
              <input
                className={`form-input ${errors.customerId ? 'border-error' : ''}`}
                {...form.register('customerId')}
              />
              {errors.customerId && (
                <p className="text-xs text-error mt-1">{errors.customerId.message}</p>
              )}
            </div>

            {/* Amount + Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Amount (minor units)
                </label>
                <input
                  type="number"
                  className={`form-input ${errors.amount ? 'border-error' : ''}`}
                  {...form.register('amount')}
                />
                {errors.amount && (
                  <p className="text-xs text-error mt-1">{errors.amount.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <input
                  className={`form-input ${errors.currency ? 'border-error' : ''}`}
                  {...form.register('currency')}
                />
                {errors.currency && (
                  <p className="text-xs text-error mt-1">{errors.currency.message}</p>
                )}
              </div>
            </div>

            {/* Payment Method Token */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Payment Method Token
              </label>
              <input
                className={`form-input ${errors.paymentMethodToken ? 'border-error' : ''}`}
                {...form.register('paymentMethodToken')}
              />
              {errors.paymentMethodToken && (
                <p className="text-xs text-error mt-1">{errors.paymentMethodToken.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                Description (optional)
              </label>
              <input className="form-input" {...form.register('description')} />
            </div>

            <hr className="border-border" />

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit charge'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                disabled={!canReplay || loading}
                onClick={replay}
              >
                Replay last key
              </button>
            </div>

            <p className="text-xs text-text-dim leading-relaxed">
              "Replay last key" uses the last successful payload + idempotency key to demonstrate
              no double-charge under retries/double-clicks.
            </p>
          </form>
        </div>

        {/* ─── Result Card ─── */}
        <div className="glass-card p-6 min-h-[360px]">
          <h3 className="text-lg font-bold text-text mb-3">Result</h3>

          {lastResult ? (
            <>
              {/* Header chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="chip">HTTP {lastResult.status}</span>
                <span className="chip text-[11px]">Key: {lastResult.idempotencyKey.slice(0, 24)}…</span>
                <span className="chip text-[11px]">
                  Hash: {lastResult.requestHash ? lastResult.requestHash.slice(0, 16) + '…' : '(missing)'}
                </span>
                {lastResult.replayed ? (
                  <span className="chip-info chip">Replayed</span>
                ) : (
                  <span className="chip-success chip">Created</span>
                )}
              </div>
              <JsonViewer title="Response body" value={lastResult.body} />
            </>
          ) : (
            <p className="text-sm text-text-dim mt-4">Submit a charge to see the response here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
