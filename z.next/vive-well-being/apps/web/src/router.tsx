import { 
  createRootRoute, 
  createRoute, 
  createRouter,
  Outlet,
  useLocation
} from '@tanstack/react-router';
import DashboardPage from './features/dashboard/DashboardPage';
import FinancePage from './features/finance/FinancePage';
import WealthPage from './features/wealth/WealthPage';
import HealthPage from './features/health/HealthPage';
import HealthCalendarPage from './features/health/HealthCalendarPage';
import HealthDocumentsPage from './features/health/HealthDocumentsPage';
import HospitalConnectPage from './features/hospital-connect/HospitalConnectPage';
import ProfilePage from './features/profile/ProfilePage';
import LoginPage from './features/auth/LoginPage';
import MainLayout from './components/MainLayout';

const rootRoute = createRootRoute({
  component: () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    if (isLoginPage) {
      return (
        <div className="min-h-screen bg-background text-foreground">
          <Outlet />
        </div>
      );
    }

    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

const financeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/finance',
  component: FinancePage,
});

const wealthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wealth',
  component: WealthPage,
});

const healthLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'health',
  component: () => <Outlet />,
});

const healthIndexRoute = createRoute({
  getParentRoute: () => healthLayoutRoute,
  path: '/health',
  component: HealthPage,
});

const healthCalendarRoute = createRoute({
  getParentRoute: () => healthLayoutRoute,
  path: '/health/calendar',
  component: HealthCalendarPage,
});

const healthDocumentsRoute = createRoute({
  getParentRoute: () => healthLayoutRoute,
  path: '/health/documents',
  component: HealthDocumentsPage,
});

const hospitalConnectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hospital-connect',
  component: HospitalConnectPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  financeRoute,
  wealthRoute,
  healthLayoutRoute.addChildren([
    healthIndexRoute,
    healthCalendarRoute,
    healthDocumentsRoute,
  ]),
  hospitalConnectRoute,
  profileRoute,
  loginRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
