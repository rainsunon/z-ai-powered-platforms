/**
 * Standalone MSW Server for Postman/External Clients
 * 
 * This server manually matches and executes MSW handlers for external clients.
 * 
 * Usage: npm run msw:server
 */

import { createServer, IncomingMessage, ServerResponse } from 'http'
import { handlers } from './handlers'

// Helper to create API response
function createResponse<T>(data: T, code: number = 200): { code: number; data: T; message: string } {
  return {
    code,
    data,
    message: 'Success',
  }
}

async function startServer() {
  console.log(`[MSW] Loading ${handlers.length} handlers...`)
  
  // Build a route map for fast lookup
  const routeMap = new Map<string, any>()
  
  handlers.forEach((handler: any) => {
    const info = handler?.info
    if (info) {
      const method = info.method?.toUpperCase()
      const path = info.path
      const key = `${method}:${path}`
      routeMap.set(key, handler)
      console.log(`  Registered: ${method} ${path}`)
    }
  })

  console.log('[MSW] Server initialized')

  const PORT = process.env.MSW_PORT || 3030

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Token, Username, Authorization')

    if (req.method === 'OPTIONS') {
      res.writeHead(200)
      res.end()
      return
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        const url = req.url || '/'
        const pathname = url.split('?')[0]
        const method = (req.method || 'GET').toUpperCase()
        const searchParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '')

        // Prepare headers
        const headers: Record<string, string> = {}
        Object.keys(req.headers).forEach((key) => {
          const value = req.headers[key]
          if (value && key !== 'host' && key !== 'connection' && key !== 'transfer-encoding') {
            headers[key] = Array.isArray(value) ? value[0] : value
          }
        })

        if (body && !headers['content-type']) {
          headers['content-type'] = 'application/json'
        }

        // Create Request object for handler
        const requestUrl = `http://localhost${url}`
        const request = new Request(requestUrl, {
          method,
          headers,
          body: body || undefined,
        })

        // Try exact match first
        let handler = routeMap.get(`${method}:${pathname}`)

        // If no exact match, try pattern matching
        if (!handler) {
          // Convert Map entries to array to avoid downlevelIteration issue
          const routeEntries = Array.from(routeMap.entries())
          for (const [key, h] of routeEntries) {
            const [handlerMethod, handlerPath] = key.split(':')
            if (handlerMethod !== method) continue

            // Pattern match for path params
            const handlerSegments = handlerPath.split('/')
            const requestSegments = pathname.split('/')

            if (handlerSegments.length === requestSegments.length) {
              let matches = true
              const params: Record<string, string> = {}

              for (let i = 0; i < handlerSegments.length; i++) {
                const handlerSeg = handlerSegments[i]
                const requestSeg = requestSegments[i]

                if (handlerSeg.startsWith(':')) {
                  params[handlerSeg.slice(1)] = requestSeg
                } else if (handlerSeg !== requestSeg) {
                  matches = false
                  break
                }
              }

              if (matches) {
                handler = h
                // Inject params into request
                ;(request as any).params = params
                break
              }
            }
          }
        }

        if (handler) {
          try {
            // Execute handler resolver
            const resolver = (handler as any).resolver
            if (!resolver) {
              throw new Error('Handler has no resolver')
            }

            // Call resolver with request
            const result = await resolver({
              request,
              params: (request as any).params || {},
            })

            // Handle HttpResponse
            if (result && typeof result === 'object') {
              let responseData: any
              
              if ('json' in result && typeof result.json === 'function') {
                responseData = await result.json()
              } else if ('body' in result) {
                responseData = result.body
              } else {
                responseData = result
              }

              const status = (result as any).status || 200
              const responseHeaders: Record<string, string> = {}
              
              if ('headers' in result && result.headers) {
                result.headers.forEach((value: string, key: string) => {
                  responseHeaders[key] = value
                })
              }

              // Set headers
              Object.entries(responseHeaders).forEach(([key, value]) => {
                if (
                  key.toLowerCase() !== 'connection' &&
                  key.toLowerCase() !== 'transfer-encoding' &&
                  key.toLowerCase() !== 'content-encoding'
                ) {
                  res.setHeader(key, value)
                }
              })

              if (!res.getHeader('content-type')) {
                res.setHeader('Content-Type', 'application/json')
              }

              res.writeHead(status)
              res.end(JSON.stringify(responseData))
              return
            }
          } catch (handlerError: any) {
            console.error(`[ERROR] Handler execution failed:`, handlerError)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({
              code: 500,
              message: 'Handler execution error',
              error: handlerError.message,
            }))
            return
          }
        }

        // No handler found
        console.error(`[ERROR] No handler for ${method} ${pathname}`)
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          code: 404,
          message: `No handler found for ${method} ${pathname}`,
          error: 'Handler not found',
        }))
      } catch (error) {
        console.error('Error handling request:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
          code: 500,
          message: 'Internal server error',
          error: error instanceof Error ? error.message : String(error),
        }))
      }
    })
  })

  httpServer.listen(PORT, () => {
    console.log('')
    console.log('🚀 MSW Standalone Server is running!')
    console.log(`📡 Server URL: http://localhost:${PORT}`)
    console.log('')
    console.log('📝 Use this URL in Postman:')
    console.log(`   http://localhost:${PORT}/api/shortlink/admin/v1/...`)
    console.log('')
    console.log('✅ Ready to accept requests!')
    console.log('')
  })

  // Graceful shutdown
  const shutdown = () => {
    console.log('\nShutting down server...')
    httpServer.close()
    process.exit(0)
  }

  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})
