/**
 * Unified API Exports
 * Matches Vue implementation pattern: API.user.login(), API.group.getGroups(), etc.
 */

import * as userAPI from './modules/user'
import * as groupAPI from './modules/group'
import * as smallLinkPageAPI from './modules/smallLinkPage'

// Create API object matching Vue pattern: API.user, API.group, API.smallLinkPage
const API = {
  user: userAPI,
  group: groupAPI,
  smallLinkPage: smallLinkPageAPI,
}

// Also export types and client for convenience
export * from './types'
export { default as apiClient } from './client'

// Export default API object (matches Vue: export default API)
export default API

// Also export named exports for convenience (alternative usage: import { login } from '@/src/api')
export * from './modules/user'
export * from './modules/group'
export * from './modules/smallLinkPage'
