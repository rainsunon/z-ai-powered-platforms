/**
 * Route preloading registry for hover-based prefetching.
 * Maps route paths to their dynamic import functions so components
 * can be preloaded on pointer hover before navigation.
 */

const routeModules: Record<string, () => Promise<unknown>> = {
  '/': () => import('../features/dashboard/Dashboard'),
  '/billing': () => import('../features/billing/Billing'),
  '/billing/history': () => import('../features/billing/PaymentHistory'),
  '/billing/methods': () => import('../features/billing/PaymentMethods'),
  '/subscription': () => import('../features/billing/Subscription'),
  '/symptoms': () => import('../features/health/Symptoms'),
  '/sleep': () => import('../features/health/SleepData'),
  '/activity': () => import('../features/health/ActivityTracking'),
  '/vitals': () => import('../features/health/VitalsTracking'),
  '/goals': () => import('../features/health/GoalManagement'),
  '/schedule': () => import('../features/health/DailySchedule'),
  '/health-plan': () => import('../features/health/HealthPlan'),
  '/habits': () => import('../features/health/HabitTracker'),
  '/medications': () => import('../features/medications/Medications'),
  '/family': () => import('../features/family/FamilyHealth'),
  '/consultation': () => import('../features/communication/Consultation'),
  '/chat': () => import('../features/communication/Chat'),
  '/documents': () => import('../features/communication/Documents'),
  '/reports': () => import('../features/communication/Reports'),
  '/support': () => import('../features/communication/Support'),
  '/profile': () => import('../features/profile/Profile'),
  '/notifications': () => import('../features/notifications/Notifications'),
  '/sync': () => import('../features/health/DataSync'),
};

const preloaded = new Set<string>();

/**
 * Preload a route's component chunk on demand. 
 * Safe to call multiple times — each path is only loaded once.
 */
export function preloadRoute(path: string): void {
  if (preloaded.has(path)) return;
  const loader = routeModules[path];
  if (loader) {
    preloaded.add(path);
    loader();
  }
}

/**
 * Returns props to spread onto a nav link element for hover-based preloading.
 * Usage: <NavLink {...preloadProps('/billing')} to="/billing">
 */
export function preloadProps(path: string) {
  return {
    onMouseEnter: () => preloadRoute(path),
    onFocus: () => preloadRoute(path),
  };
}
