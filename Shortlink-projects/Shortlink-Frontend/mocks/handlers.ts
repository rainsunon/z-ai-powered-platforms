import { http, HttpResponse } from 'msw'
import type {
  ApiResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  ShortLink,
  CreateShortLinkRequest,
  BatchCreateShortLinkRequest,
  UpdateShortLinkRequest,
  ShortLinkListParams,
  PaginatedResponse,
  AnalyticsResponse,
} from '@/src/api/types'

// Mock data storage (in-memory)
const mockUsers: User[] = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    phone: '1234567890',
    realName: 'Test User',
    createdAt: '2024-01-01T00:00:00Z',
  },
]

const mockGroups: Group[] = [
  {
    id: '1',
    gid: 'group1',
    name: 'Default Group',
    title: 'Default Group',
    description: 'Default group for short links',
    sortOrder: 1,
    shortLinkCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    gid: 'group2',
    name: 'Work',
    title: 'Work',
    description: 'Work related links',
    sortOrder: 2,
    shortLinkCount: 3,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
]

const mockShortLinks: ShortLink[] = [
  {
    id: '1',
    gid: 'group1',
    shortCode: 'abc123',
    shortUri: '/abc123',
    fullShortUrl: 'https://shortlink.tus/abc123',
    domain: 'shortlink.tus',
    originalUrl: 'https://example.com/page1',
    originUrl: 'https://example.com/page1',
    title: 'Example Page 1',
    describe: 'Example Page 1',
    description: 'Example Page 1',
    groupId: 'group1',
    groupName: 'Default Group',
    visitCount: 100,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    createTime: '2024-01-01T00:00:00Z',
    todayPv: 10,
    totalPv: 100,
    todayUv: 8,
    totalUv: 80,
    todayUip: 5,
    totalUip: 50,
  },
  {
    id: '2',
    gid: 'group1',
    shortCode: 'def456',
    shortUri: '/def456',
    fullShortUrl: 'https://shortlink.tus/def456',
    domain: 'shortlink.tus',
    originalUrl: 'https://example.com/page2',
    originUrl: 'https://example.com/page2',
    title: 'Example Page 2',
    describe: 'Example Page 2',
    groupId: 'group1',
    groupName: 'Default Group',
    visitCount: 50,
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    createTime: '2024-01-02T00:00:00Z',
    todayPv: 5,
    totalPv: 50,
    todayUv: 4,
    totalUv: 40,
    todayUip: 3,
    totalUip: 30,
  },
]

// Helper function to create API response
const createResponse = <T>(data: T, code = 200, message = 'Success'): ApiResponse<T> => ({
  code,
  message,
  data,
})

// User API Handlers
export const userHandlers = [
  // POST /api/shortlink/admin/v1/user/login
  http.post('/api/shortlink/admin/v1/user/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest

    if (body.username === 'testuser' && body.password === 'password') {
      const user = mockUsers[0]
      const response: LoginResponse = {
        token: 'mock-jwt-token-12345',
        user,
      }
      return HttpResponse.json(createResponse(response))
    }

    return HttpResponse.json(
      createResponse(null, 401, 'Invalid username or password'),
      { status: 401 }
    )
  }),

  // POST /api/shortlink/admin/v1/user
  http.post('/api/shortlink/admin/v1/user', async ({ request }) => {
    const body = (await request.json()) as RegisterRequest

    // Check if username already exists
    if (mockUsers.some((u) => u.username === body.username)) {
      return HttpResponse.json(
        createResponse(null, 400, 'Username already exists'),
        { status: 400 }
      )
    }

    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: body.username,
      email: body.email,
      createdAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return HttpResponse.json(createResponse(newUser))
  }),

  // PUT /api/shortlink/admin/v1/user
  http.put('/api/shortlink/admin/v1/user', async ({ request }) => {
    const body = (await request.json()) as Partial<User>
    const userIndex = mockUsers.findIndex((u) => u.id === body.id)

    if (userIndex === -1) {
      return HttpResponse.json(createResponse(null, 404, 'User not found'), { status: 404 })
    }

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body }
    return HttpResponse.json(createResponse(mockUsers[userIndex]))
  }),

  // DELETE /api/shortlink/admin/v1/user/logout
  http.delete('/api/shortlink/admin/v1/user/logout', () => {
    return HttpResponse.json(createResponse(null))
  }),

  // GET /api/shortlink/admin/v1/user/has-username
  http.get('/api/shortlink/admin/v1/user/has-username', ({ request }) => {
    const url = new URL(request.url)
    const username = url.searchParams.get('username')

    const exists = mockUsers.some((u) => u.username === username)
    return HttpResponse.json(createResponse({ available: !exists, success: true }))
  }),

  // GET /api/shortlink/admin/v1/actual/user/:username
  http.get('/api/shortlink/admin/v1/actual/user/:username', ({ params }) => {
    const { username } = params
    const user = mockUsers.find((u) => u.username === username)

    if (!user) {
      return HttpResponse.json(createResponse(null, 404, 'User not found'), { status: 404 })
    }

    return HttpResponse.json(createResponse(user))
  }),

  // GET /api/shortlink/admin/v1/user/info
  http.get('/api/shortlink/admin/v1/user/info', () => {
    // Return first user as current user
    return HttpResponse.json(createResponse(mockUsers[0]))
  }),
]

// Group API Handlers
export const groupHandlers = [
  // GET /api/shortlink/admin/v1/group
  http.get('/api/shortlink/admin/v1/group', () => {
    return HttpResponse.json(createResponse(mockGroups))
  }),

  // POST /api/shortlink/admin/v1/group
  http.post('/api/shortlink/admin/v1/group', async ({ request }) => {
    const body = (await request.json()) as CreateGroupRequest

    const newGroup: Group = {
      id: String(mockGroups.length + 1),
      gid: `group${mockGroups.length + 1}`,
      name: body.name,
      title: body.name,
      description: body.description,
      sortOrder: mockGroups.length + 1,
      shortLinkCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockGroups.push(newGroup)
    return HttpResponse.json(createResponse(newGroup))
  }),

  // PUT /api/shortlink/admin/v1/group
  http.put('/api/shortlink/admin/v1/group', async ({ request }) => {
    const body = (await request.json()) as UpdateGroupRequest
    const groupIndex = mockGroups.findIndex((g) => g.id === body.id)

    if (groupIndex === -1) {
      return HttpResponse.json(createResponse(null, 404, 'Group not found'), { status: 404 })
    }

    mockGroups[groupIndex] = { ...mockGroups[groupIndex], ...body }
    return HttpResponse.json(createResponse(mockGroups[groupIndex]))
  }),

  // DELETE /api/shortlink/admin/v1/group
  http.delete('/api/shortlink/admin/v1/group', ({ request }) => {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    const groupIndex = mockGroups.findIndex((g) => g.id === id)
    if (groupIndex === -1) {
      return HttpResponse.json(createResponse(null, 404, 'Group not found'), { status: 404 })
    }

    mockGroups.splice(groupIndex, 1)
    return HttpResponse.json(createResponse(null))
  }),

  // POST /api/shortlink/admin/v1/group/sort
  http.post('/api/shortlink/admin/v1/group/sort', () => {
    return HttpResponse.json(createResponse(null))
  }),

  // GET /api/shortlink/admin/v1/stats/group
  http.get('/api/shortlink/admin/v1/stats/group', () => {
    return HttpResponse.json(createResponse({ total: mockGroups.length }))
  }),

  // GET /api/shortlink/admin/v1/stats/access-record/group
  http.get('/api/shortlink/admin/v1/stats/access-record/group', () => {
    return HttpResponse.json(createResponse({ records: [], total: 0 }))
  }),
]

// Short Link API Handlers
export const shortLinkHandlers = [
  // GET /api/shortlink/admin/v1/page
  http.get('/api/shortlink/admin/v1/page', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const gid = url.searchParams.get('gid')
    const keyword = url.searchParams.get('keyword')

    let filteredLinks = [...mockShortLinks]

    // Filter by group
    if (gid && gid !== 'null') {
      filteredLinks = filteredLinks.filter((link) => link.gid === gid)
    }

    // Filter by keyword
    if (keyword) {
      filteredLinks = filteredLinks.filter(
        (link) =>
          link.originalUrl?.includes(keyword) ||
          link.title?.includes(keyword) ||
          link.describe?.includes(keyword)
      )
    }

    // Pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedLinks = filteredLinks.slice(start, end)

    const response: PaginatedResponse<ShortLink> = {
      list: paginatedLinks,
      records: paginatedLinks,
      total: filteredLinks.length,
      page,
      current: page,
      pageSize,
      size: pageSize,
    }

    return HttpResponse.json(createResponse(response))
  }),

  // POST /api/shortlink/v1/links/create
  http.post('/api/shortlink/v1/links/create', async ({ request }) => {
    const body = (await request.json()) as CreateShortLinkRequest

    const newLink: ShortLink = {
      id: String(mockShortLinks.length + 1),
      gid: body.gid || 'group1',
      shortCode: `link${mockShortLinks.length + 1}`,
      shortUri: `/link${mockShortLinks.length + 1}`,
      fullShortUrl: `https://shortlink.tus/link${mockShortLinks.length + 1}`,
      domain: body.domain || 'shortlink.tus',
      originalUrl: body.originUrl || body.originalUrl || '',
      originUrl: body.originUrl || body.originalUrl || '',
      title: body.title || body.describe || '',
      describe: body.describe || body.title || body.description || '',
      description: body.description || body.describe || body.title || '',
      groupId: body.gid || 'group1',
      groupName: mockGroups.find((g) => g.gid === body.gid)?.name || 'Default Group',
      visitCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      createTime: new Date().toISOString(),
      validDate: body.validDate === null ? undefined : body.validDate,
      validDateType: body.validDateType || 0,
      todayPv: 0,
      totalPv: 0,
      todayUv: 0,
      totalUv: 0,
      todayUip: 0,
      totalUip: 0,
    }

    mockShortLinks.push(newLink)
    return HttpResponse.json(createResponse(newLink))
  }),

  // POST /api/shortlink/admin/v1/create/batch
  http.post('/api/shortlink/admin/v1/create/batch', async ({ request }) => {
    const body = (await request.json()) as BatchCreateShortLinkRequest

    const urls = body.originUrls || []
    const describes = body.describes || []

    // Create multiple links
    const createdLinks: ShortLink[] = []
    for (let i = 0; i < urls.length; i++) {
      const newLink: ShortLink = {
        id: String(mockShortLinks.length + i + 1),
        gid: body.gid || 'group1',
        shortCode: `link${mockShortLinks.length + i + 1}`,
        shortUri: `/link${mockShortLinks.length + i + 1}`,
        fullShortUrl: `https://shortlink.tus/link${mockShortLinks.length + i + 1}`,
        domain: body.domain || 'shortlink.tus',
        originalUrl: urls[i],
        originUrl: urls[i],
        title: describes[i] || '',
        describe: describes[i] || '',
        description: describes[i] || '',
        groupId: body.gid || 'group1',
        groupName: mockGroups.find((g) => g.gid === body.gid)?.name || 'Default Group',
        visitCount: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        createTime: new Date().toISOString(),
        validDate: body.validDate === null ? undefined : body.validDate,
        validDateType: body.validDateType || 0,
      }
      createdLinks.push(newLink)
      mockShortLinks.push(newLink)
    }

    // Return ArrayBuffer (Excel file) - simplified as empty buffer for mock
    return new HttpResponse(new ArrayBuffer(0), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })
  }),

  // POST /api/shortlink/admin/v1/update
  http.post('/api/shortlink/admin/v1/update', async ({ request }) => {
    const body = (await request.json()) as UpdateShortLinkRequest
    const linkIndex = mockShortLinks.findIndex(
      (link) => link.id === body.id || link.fullShortUrl === body.fullShortUrl
    )

    if (linkIndex === -1) {
      return HttpResponse.json(createResponse(null, 404, 'Link not found'), { status: 404 })
    }

    // Convert null to undefined for validDate to match ShortLink type
    const validDate = body.validDate === null ? undefined : body.validDate

    mockShortLinks[linkIndex] = {
      ...mockShortLinks[linkIndex],
      ...body,
      originalUrl: body.originUrl || body.originalUrl || mockShortLinks[linkIndex].originalUrl,
      originUrl: body.originUrl || body.originalUrl || mockShortLinks[linkIndex].originUrl,
      describe: body.describe || body.title || body.description || mockShortLinks[linkIndex].describe,
      title: body.title || body.describe || body.description || mockShortLinks[linkIndex].title,
      description: body.description || body.describe || body.title || mockShortLinks[linkIndex].description,
      gid: body.gid || body.groupId || mockShortLinks[linkIndex].gid,
      validDate: validDate !== undefined ? validDate : mockShortLinks[linkIndex].validDate,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(createResponse(mockShortLinks[linkIndex]))
  }),

  // GET /api/shortlink/admin/v1/title
  http.get('/api/shortlink/admin/v1/title', ({ request }) => {
    const url = new URL(request.url)
    const urlParam = url.searchParams.get('url')

    // Mock title extraction
    const title = urlParam ? `Title for ${urlParam}` : 'Default Title'
    return HttpResponse.json(createResponse({ title }))
  }),

  // POST /api/shortlink/admin/v1/recycle-bin/save
  http.post('/api/shortlink/admin/v1/recycle-bin/save', async ({ request }) => {
    const body = (await request.json()) as { id?: string; gid?: string; fullShortUrl?: string }
    const linkIndex = mockShortLinks.findIndex(
      (link) => link.id === body.id || link.gid === body.gid || link.fullShortUrl === body.fullShortUrl
    )

    if (linkIndex !== -1) {
      mockShortLinks[linkIndex].status = 'deleted'
    }

    return HttpResponse.json(createResponse(null))
  }),

  // GET /api/shortlink/admin/v1/recycle-bin/page
  http.get('/api/shortlink/admin/v1/recycle-bin/page', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    const deletedLinks = mockShortLinks.filter((link) => link.status === 'deleted')
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedLinks = deletedLinks.slice(start, end)

    const response: PaginatedResponse<ShortLink> = {
      list: paginatedLinks,
      records: paginatedLinks,
      total: deletedLinks.length,
      page,
      current: page,
      pageSize,
      size: pageSize,
    }

    return HttpResponse.json(createResponse(response))
  }),

  // POST /api/shortlink/admin/v1/recycle-bin/recover
  http.post('/api/shortlink/admin/v1/recycle-bin/recover', async ({ request }) => {
    const body = (await request.json()) as { id?: string; gid?: string; fullShortUrl?: string }
    const linkIndex = mockShortLinks.findIndex(
      (link) => link.id === body.id || link.gid === body.gid || link.fullShortUrl === body.fullShortUrl
    )

    if (linkIndex !== -1) {
      mockShortLinks[linkIndex].status = 'active'
    }

    return HttpResponse.json(createResponse(null))
  }),

  // POST /api/shortlink/admin/v1/recycle-bin/remove
  http.post('/api/shortlink/admin/v1/recycle-bin/remove', async ({ request }) => {
    const body = (await request.json()) as { id?: string; gid?: string; fullShortUrl?: string }
    const linkIndex = mockShortLinks.findIndex(
      (link) => link.id === body.id || link.gid === body.gid || link.fullShortUrl === body.fullShortUrl
    )

    if (linkIndex !== -1) {
      mockShortLinks.splice(linkIndex, 1)
    }

    return HttpResponse.json(createResponse(null))
  }),

  // GET /api/shortlink/admin/v1/stats
  http.get('/api/shortlink/admin/v1/stats', ({ request }) => {
    const url = new URL(request.url)
    const gid = url.searchParams.get('gid')
    const startDate = url.searchParams.get('startDate')
    const endDate = url.searchParams.get('endDate')

    // Mock analytics data
    const analytics: AnalyticsResponse = {
      totalVisits: 150,
      todayVisits: 15,
      daily: [
        { date: '2024-01-01', pv: 10, uv: 8, uip: 5 },
        { date: '2024-01-02', pv: 15, uv: 12, uip: 8 },
        { date: '2024-01-03', pv: 20, uv: 15, uip: 10 },
      ],
      hourStats: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 20)),
      weekdayStats: Array.from({ length: 7 }, (_, i) => Math.floor(Math.random() * 30)),
      localeCnStats: [
        { locale: 'CN', cnt: 100, ratio: 0.67 },
        { locale: 'US', cnt: 50, ratio: 0.33 },
      ],
      topIpStats: [
        { ip: '192.168.1.1', cnt: 50 },
        { ip: '192.168.1.2', cnt: 30 },
      ],
      osStats: [
        { os: 'Windows', cnt: 80 },
        { os: 'macOS', cnt: 50 },
        { os: 'Linux', cnt: 20 },
      ],
      browserStats: [
        { browser: 'Chrome', cnt: 100 },
        { browser: 'Firefox', cnt: 30 },
        { browser: 'Safari', cnt: 20 },
      ],
      uvTypeStats: [
        { uvType: 'new', cnt: 80 },
        { uvType: 'returning', cnt: 70 },
      ],
      deviceStats: [
        { device: 'Desktop', cnt: 100 },
        { device: 'Mobile', cnt: 50 },
      ],
      networkStats: [
        { device: 'WiFi', cnt: 120 },
        { device: '4G', cnt: 30 },
      ],
    }

    return HttpResponse.json(createResponse(analytics))
  }),

  // GET /api/shortlink/admin/v1/stats/access-record
  http.get('/api/shortlink/admin/v1/stats/access-record', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')

    // Mock access logs
    const accessLogs = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      shortLinkId: '1',
      ip: `192.168.1.${i + 1}`,
      userAgent: 'Mozilla/5.0...',
      referer: 'https://example.com',
      accessedAt: new Date().toISOString(),
      createTime: new Date().toISOString(),
      locale: 'CN',
      device: i % 2 === 0 ? 'Desktop' : 'Mobile',
      browser: 'Chrome',
      os: 'Windows',
      network: 'WiFi',
      uvType: i % 2 === 0 ? 'new' : 'returning',
    }))

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedLogs = accessLogs.slice(start, end)

    const response = {
      list: paginatedLogs,
      records: paginatedLogs,
      total: accessLogs.length,
      page,
      current: page,
      pageSize,
      size: pageSize,
    }

    return HttpResponse.json(createResponse(response))
  }),
]

// Combine all handlers
export const handlers = [...userHandlers, ...groupHandlers, ...shortLinkHandlers]
