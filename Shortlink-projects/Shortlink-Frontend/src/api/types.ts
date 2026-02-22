// API Response Types
// Backend Result format: { code: "0" (string), message, data, requestId? }
// Success code is "0" as string, not number

export interface ApiResponse<T = any> {
  code: string | number  // Backend returns string "0" for success, but support number for compatibility
  message: string
  data: T
  requestId?: string  // Optional request ID from gateway
}

export interface PaginatedResponse<T> {
  list?: T[]
  records?: T[]
  elements?: T[]  // Backend returns "elements" field
  total: number
  page?: number
  current?: number
  pageSize?: number
  size?: number
  start?: number  // Backend returns "start" field (offset)
  page_size?: number  // Backend returns "page_size" field
}

// User Types
export interface User {
  id?: string
  username: string
  email?: string
  mail?: string
  phone?: string
  realName?: string
  password?: string
  createdAt?: string
}

export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  token: string
  user?: User  // Legacy field name
  userInfo?: User  // Backend uses "userInfo"
}

export interface RegisterRequest {
  username: string
  password: string
  email?: string
}

// Group Types
export interface Group {
  id?: string
  gid?: string
  name: string
  title?: string
  description?: string
  sortOrder?: number
  shortLinkCount?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateGroupRequest {
  name: string
  description?: string
}

export interface UpdateGroupRequest {
  id: string
  name?: string
  description?: string
}

// Short Link Types
export interface ShortLink {
  id?: string
  gid?: string
  shortCode?: string
  shortUri?: string
  fullShortUrl?: string
  domain?: string
  originalUrl?: string
  originUrl?: string
  title?: string
  describe?: string
  description?: string
  groupId?: string
  groupName?: string
  visitCount?: number
  status?: 'active' | 'deleted'
  createdAt?: string
  createTime?: string
  updatedAt?: string
  icon?: string
  favicon?: string
  validDate?: string
  validDateType?: number
  enableStatus?: number
  todayPv?: number
  totalPv?: number
  todayUv?: number
  totalUv?: number
  todayUip?: number
  totalUip?: number
}

export interface CreateShortLinkRequest {
  originUrl?: string // For single link
  originalUrl?: string // Alternative field name
  describe?: string // Description/Title
  title?: string // Alternative field name
  description?: string // Alternative field name
  gid?: string // Group ID
  groupId?: string // Alternative field name
  shortCode?: string
  createdType?: number // 1 = manual creation
  validDate?: string | null // Format: YYYY-MM-DD HH:mm:ss
  validDateType?: number // 0 = permanent, 1 = custom
  domain?: string
}

export interface BatchCreateShortLinkRequest {
  originUrls: string[] // Array of URLs
  describes: string[] // Array of descriptions/titles
  gid?: string // Group ID
  groupId?: string // Alternative field name
  createdType?: number // 1 = manual creation
  validDate?: string | null // Format: YYYY-MM-DD HH:mm:ss
  validDateType?: number // 0 = permanent, 1 = custom
  domain?: string
  // Legacy format (for compatibility)
  links?: Array<{
    originalUrl: string
    title?: string
    description?: string
    groupId?: string
  }>
}

export interface UpdateShortLinkRequest {
  id?: string
  fullShortUrl?: string
  originUrl?: string
  originalUrl?: string
  describe?: string
  title?: string
  description?: string
  gid?: string
  groupId?: string
  originGid?: string // Original group ID before edit
  createdType?: number
  validDate?: string | null
  validDateType?: number
  domain?: string
}

export interface RecycleBinListParams {
  gidList?: string[]  // List of group IDs for recycle bin query
  current?: number    // Page number (maps to pageNum)
  size?: number       // Page size (maps to pageSize)
}

export interface ShortLinkListParams {
  page?: number
  pageSize?: number
  current?: number
  size?: number
  gid?: string | null
  groupId?: string
  keyword?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  orderTag?: string | null
  enableStatus?: number  // 0 = active, 1 = deleted (in recycle bin)
}

// Analytics Types
export interface AnalyticsData {
  date: string
  count: number
}

export interface AccessLog {
  id?: string
  shortLinkId?: string
  ip?: string
  userAgent?: string
  referer?: string
  accessedAt?: string
  createTime?: string
  locale?: string
  device?: string
  browser?: string
  os?: string
  network?: string
  uvType?: string
}

export interface AnalyticsResponse {
  totalVisits?: number
  todayVisits?: number
  dateRange?: AnalyticsData[]
  accessLogs?: AccessLog[]
  // Additional fields from Vue component
  daily?: Array<{
    date: string
    pv: number
    uv: number
    uip: number
  }>
  hourStats?: number[]
  weekdayStats?: number[]
  localeCnStats?: Array<{
    locale: string
    cnt: number
    ratio: number
  }>
  topIpStats?: Array<{
    ip: string
    cnt: number
  }>
  osStats?: Array<{
    os: string
    cnt: number
  }>
  browserStats?: Array<{
    browser: string
    cnt: number
  }>
  uvTypeStats?: Array<{
    uvType: string
    cnt: number
  }>
  deviceStats?: Array<{
    device: string
    cnt: number
  }>
  networkStats?: Array<{
    device: string
    cnt: number
  }>
}
