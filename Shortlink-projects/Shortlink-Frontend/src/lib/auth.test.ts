/// <reference types="jest" />
import * as auth from './auth'
import Cookies from 'js-cookie'

    // Mock js-cookie
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
    }))

    describe('Auth Utility Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks()
})

    // ============================================
    // Token Management
    // ============================================
    describe('Token Management', () => {
        it('getToken returns token from cookies', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue('test-token-123')
        
        const token = auth.getToken()
        
        expect(token).toBe('test-token-123')
        expect(Cookies.get).toHaveBeenCalledWith('token')
        })

        it('getToken returns undefined when token does not exist', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
        
        const token = auth.getToken()
        
        expect(token).toBeUndefined()
        })

        it('setToken sets token without expiration when rememberMe is false', () => {
        auth.setToken('test-token', false)
        
        expect(Cookies.set).toHaveBeenCalledWith('token', 'test-token')
        })

        it('setToken sets token without rememberMe parameter (defaults to session)', () => {
        auth.setToken('test-token')
        
        expect(Cookies.set).toHaveBeenCalledWith('token', 'test-token')
        })

        it('setToken sets token with 7 days expiration when rememberMe is true', () => {
        auth.setToken('test-token', true)
        
        expect(Cookies.set).toHaveBeenCalledWith('token', 'test-token', { expires: 7 })
        })

        it('removeToken removes token from cookies', () => {
        auth.removeToken()
        
        expect(Cookies.remove).toHaveBeenCalledWith('token')
        })

        it('removeKey is an alias for removeToken', () => {
        auth.removeKey()
        
        expect(Cookies.remove).toHaveBeenCalledWith('token')
        })
    })

    // ============================================
    // Username Management
    // ============================================
    describe('Username Management', () => {
        it('getUsername returns username from cookies', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue('testuser')
        
        const username = auth.getUsername()
        
        expect(username).toBe('testuser')
        expect(Cookies.get).toHaveBeenCalledWith('username')
        })

        it('getUsername returns undefined when username does not exist', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
        
        const username = auth.getUsername()
        
        expect(username).toBeUndefined()
        })

        it('setUsername sets username without expiration when rememberMe is false', () => {
        auth.setUsername('testuser', false)
        
        expect(Cookies.set).toHaveBeenCalledWith('username', 'testuser')
        })

        it('setUsername sets username without rememberMe parameter (defaults to session)', () => {
        auth.setUsername('testuser')
        
        expect(Cookies.set).toHaveBeenCalledWith('username', 'testuser')
        })

        it('setUsername sets username with 7 days expiration when rememberMe is true', () => {
        auth.setUsername('testuser', true)
        
        expect(Cookies.set).toHaveBeenCalledWith('username', 'testuser', { expires: 7 })
        })

        it('removeUsername removes username from cookies', () => {
        auth.removeUsername()
        
        expect(Cookies.remove).toHaveBeenCalledWith('username')
        })
    })

  // ============================================
  // Combined Auth Functions
  // ============================================
    describe('Combined Auth Functions', () => {
        it('clearAuth removes both token and username', () => {
        auth.clearAuth()
        
        expect(Cookies.remove).toHaveBeenCalledWith('token')
        expect(Cookies.remove).toHaveBeenCalledWith('username')
        expect(Cookies.remove).toHaveBeenCalledTimes(2)
        })

        it('isAuthenticated returns true when token exists', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue('test-token')
        
        const isAuth = auth.isAuthenticated()
        
        expect(isAuth).toBe(true)
        expect(Cookies.get).toHaveBeenCalledWith('token')
        })

        it('isAuthenticated returns false when token does not exist', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
        
        const isAuth = auth.isAuthenticated()
        
        expect(isAuth).toBe(false)
        })

        it('isAuthenticated returns false when token is empty string', () => {
        ;(Cookies.get as jest.Mock).mockReturnValue('')
        
        const isAuth = auth.isAuthenticated()
        
        expect(isAuth).toBe(false)
        })
    })
})
