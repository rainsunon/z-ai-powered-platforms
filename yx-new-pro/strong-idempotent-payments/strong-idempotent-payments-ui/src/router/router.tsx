import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { PageLoader } from '../components/PageLoader';

/* ─── Lazy-loaded page chunks ─── */
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ChargePage = lazy(() => import('../pages/ChargePage'));
const PaymentLookupPage = lazy(() => import('../pages/PaymentLookupPage'));
const IdempotencyPlaygroundPage = lazy(() => import('../pages/IdempotencyPlaygroundPage'));

/** Wrap a lazy component with a Suspense boundary */
function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'charges', element: withSuspense(ChargePage) },
      { path: 'payments', element: withSuspense(PaymentLookupPage) },
      { path: 'idempotency', element: withSuspense(IdempotencyPlaygroundPage) },
    ],
  },
]);
