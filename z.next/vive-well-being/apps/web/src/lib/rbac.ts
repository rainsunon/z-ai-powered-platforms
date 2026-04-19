import { UserRole } from './store';

export type Permission = 
  | 'view_basic_finance'
  | 'view_detailed_reports'
  | 'export_data'
  | 'ai_insights'
  | 'budget_optimization'
  | 'view_wealth_dashboard'
  | 'advanced_wealth_metrics'
  | 'real_property_tracking'
  | 'telehealth_access';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  free: [
    'view_basic_finance',
    'view_wealth_dashboard'
  ],
  pro: [
    'view_basic_finance',
    'view_detailed_reports',
    'export_data',
    'view_wealth_dashboard',
    'advanced_wealth_metrics',
    'telehealth_access'
  ],
  premium: [
    'view_basic_finance',
    'view_detailed_reports',
    'export_data',
    'ai_insights',
    'budget_optimization',
    'view_wealth_dashboard',
    'advanced_wealth_metrics',
    'real_property_tracking',
    'telehealth_access'
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function canAccessFeature(role: UserRole, requiredPermission: Permission): boolean {
  return hasPermission(role, requiredPermission);
}
