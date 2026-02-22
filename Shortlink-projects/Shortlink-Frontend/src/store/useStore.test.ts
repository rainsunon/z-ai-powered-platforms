/// <reference types="jest" />
import { renderHook, act } from "@testing-library/react";
import { useStore, useDomain, useUI, useUser, useGroups, useModals } from './useStore'; 
import type { User, Group } from '@/src/api/types'; 
import { stat } from "fs";

describe('useStore Hook', () => { 
    beforeEach(() => { 
        // Reset store to initial state before each test 
        const store = useStore.getState()
        store.setDomain('shortlink.tus')
        store.setSidebarOpen(true)
        store.setUser(null)
        store.setGroups([])
        store.setSelectedGroupId(null)
        // Reset modals
        Object.keys(store.modals).forEach((item) => { 
            store.closeModal(item)
        })
    })


  // ============================================
  // Domain State
  // ============================================

    describe('Domain State', () => { 
        it('has default domain value', () => { 
            const { result } = renderHook(() => useStore((state) => state.domain))
            expect(result.current).toBe('shortlink.tus')
        })

        it('sets domain correctly', () => { 
            const { result } = renderHook(() => useStore((state) => state.setDomain))

            act(() => { 
                result.current('new-domain.com')
            })

            const domainResult = renderHook(() => useStore((state) => state.domain))
            expect(domainResult.result.current).toBe('new-domain.com')
        })

        it('useDomain selector returns domain and setDomain', () => { 
            const { result } = renderHook(() => useDomain())
            expect(result.current.domain).toBe('shortlink.tus')
            expect(typeof result.current.setDomain).toBe('function')

            act(() => { 
                result.current.setDomain('custom-domain.com')
            })

            expect(result.current.domain).toBe('custom-domain.com')
        })
    })

    // ============================================
    // UI State (Sidebar)
    // ============================================
    describe('UI State', () => { 
        it('has default sidebarOpen value', () => { 
            const { result } = renderHook(() => useStore((state) => state.sidebarOpen))
            expect(result.current).toBe(true)
        })

        it('sets sidebarOpen correctly', () => { 
            const { result } = renderHook(() => useStore((state) => state.setSidebarOpen))

            act(() => { 
                result.current(false)
            })

            const sidebarResult = renderHook(() => useStore((state) => state.sidebarOpen))
            expect(sidebarResult.result.current).toBe(false)
        })

        it('toggles sidebar correctly', () => { 
            const { result } = renderHook(() => useStore((state) => state.toggleSidebar))

            // initial state is true 
            let sidebarState = renderHook(() => useStore((state) => state.sidebarOpen))
            expect(sidebarState.result.current).toBe(true)

            act(() => { 
                result.current()
            })

            sidebarState = renderHook(() => useStore((state) => state.sidebarOpen))
            expect(sidebarState.result.current).toBe(false)

            act(() => { 
                result.current()
            })

            sidebarState = renderHook(() => useStore((state) => state.sidebarOpen))
            expect(sidebarState.result.current).toBe(true)
        })

        it('useUI selector returns UI state and functions', () => {
            const { result } = renderHook(() => useUI())

            expect(result.current.sidebarOpen).toBe(true)
            expect(typeof result.current.setSidebarOpen).toBe('function')
            expect(typeof result.current.toggleSidebar).toBe('function')
        })
    })

    // ============================================
    // User State
    // ============================================
    describe('User State', () => { 
        const mockUser: User = {
            id: '1',
            username: 'testuser',
            email: 'test@example.com'
        }

        it('has default user value (null)', () => { 
            const { result } = renderHook(() => useStore((state) => state.user))
            expect(result.current).toBeNull()
        })

        it('sets user correctly', () => { 
            const { result } = renderHook(() => useStore((state) => state.setUser))

            act(() => { 
                result.current(mockUser)
            })

            const userResult = renderHook(() => useStore((state) => state.user))
            expect(userResult.result.current).toEqual(mockUser)
        })

        it('clears user when set to null', () => { 
            const { result } = renderHook(() => useStore((state) => state.setUser))

            // set user first 
            act(() => { 
                result.current(mockUser)
            })

            // clear user 
            const nonNullUserResult = renderHook(() => useStore((state) => state.user))
            expect(nonNullUserResult.result.current).toEqual(mockUser)

            act(() => { 
                result.current(null)
            })
            const userResult = renderHook(() => useStore((state) => state.user))
            expect(userResult.result.current).toBeNull()
        })

        it('useUser selector returns user and setUser', () => { 
            const { result } = renderHook(() => useUser())
            expect(result.current.user).toBeNull() 
            act(() => { 
                result.current.setUser(mockUser)
            })
            expect(result.current.user).toEqual(mockUser)
        })
    })

    // ============================================
    // Group State
    // ============================================
    describe('Group State', () => {
        const mockGroup1: Group = {
        id: '1',
        gid: 'group1',
        name: 'Group 1',
        title: 'Group 1',
        }

        const mockGroup2: Group = {
        id: '2',
        gid: 'group2',
        name: 'Group 2',
        title: 'Group 2',
        }

        it('has default groups array (empty)', () => {
        const { result } = renderHook(() => useStore((state) => state.groups))

        expect(result.current).toEqual([])
        })

        it('sets groups correctly', () => {
        const { result } = renderHook(() => useStore((state) => state.setGroups))

        act(() => {
            result.current([mockGroup1, mockGroup2])
        })

        const groupsResult = renderHook(() => useStore((state) => state.groups))
        expect(groupsResult.result.current).toHaveLength(2)
        expect(groupsResult.result.current[0]).toEqual(mockGroup1)
        })

        it('adds group correctly', () => {
        const { result } = renderHook(() => useStore((state) => state.addGroup))

        act(() => {
            result.current(mockGroup1)
        })

        const groupsResult = renderHook(() => useStore((state) => state.groups))
        expect(groupsResult.result.current).toHaveLength(1)
        expect(groupsResult.result.current[0]).toEqual(mockGroup1)

        act(() => {
            result.current(mockGroup2)
        })

        expect(groupsResult.result.current).toHaveLength(2)
        })

        it('updates group correctly', () => {
        const { result: setGroupsResult } = renderHook(() => useStore((state) => state.setGroups))
        const { result: updateGroupResult } = renderHook(() => useStore((state) => state.updateGroup))

        // Set initial groups
        act(() => {
            setGroupsResult.current([mockGroup1, mockGroup2])
        })

        // Update group
        const updatedGroup: Group = { ...mockGroup1, name: 'Updated Group 1' }
        act(() => {
            updateGroupResult.current(updatedGroup)
        })

        const groupsResult = renderHook(() => useStore((state) => state.groups))
        expect(groupsResult.result.current[0].name).toBe('Updated Group 1')
        expect(groupsResult.result.current[1]).toEqual(mockGroup2) // Unchanged
        })

        it('removes group correctly', () => {
        const { result: setGroupsResult } = renderHook(() => useStore((state) => state.setGroups))
        const { result: removeGroupResult } = renderHook(() => useStore((state) => state.removeGroup))

        // Set initial groups
        act(() => {
            setGroupsResult.current([mockGroup1, mockGroup2])
        })

        // Remove group
        act(() => {
            removeGroupResult.current('1')
        })

        const groupsResult = renderHook(() => useStore((state) => state.groups))
        expect(groupsResult.result.current).toHaveLength(1)
        expect(groupsResult.result.current[0]).toEqual(mockGroup2)
        })

        it('clears selectedGroupId when removing selected group', () => {
        const { result: setGroupsResult } = renderHook(() => useStore((state) => state.setGroups))
        const { result: setSelectedResult } = renderHook(() => useStore((state) => state.setSelectedGroupId))
        const { result: removeGroupResult } = renderHook(() => useStore((state) => state.removeGroup))

        // Set initial groups and selection
        act(() => {
            setGroupsResult.current([mockGroup1, mockGroup2])
            setSelectedResult.current('1')
        })

        // Remove selected group
        act(() => {
            removeGroupResult.current('1')
        })

        const selectedResult = renderHook(() => useStore((state) => state.selectedGroupId))
        expect(selectedResult.result.current).toBeNull()
        })

        it('keeps selectedGroupId when removing non-selected group', () => {
        const { result: setGroupsResult } = renderHook(() => useStore((state) => state.setGroups))
        const { result: setSelectedResult } = renderHook(() => useStore((state) => state.setSelectedGroupId))
        const { result: removeGroupResult } = renderHook(() => useStore((state) => state.removeGroup))

        // Set initial groups and selection
        act(() => {
            setGroupsResult.current([mockGroup1, mockGroup2])
            setSelectedResult.current('1')
        })

        // Remove non-selected group
        act(() => {
            removeGroupResult.current('2')
        })

        const selectedResult = renderHook(() => useStore((state) => state.selectedGroupId))
        expect(selectedResult.result.current).toBe('1')
        })

        it('sets selectedGroupId correctly', () => {
        const { result } = renderHook(() => useStore((state) => state.setSelectedGroupId))

        act(() => {
            result.current('group1')
        })

        const selectedResult = renderHook(() => useStore((state) => state.selectedGroupId))
        expect(selectedResult.result.current).toBe('group1')
        })

        it('useGroups selector returns groups state and functions', () => {
        const { result } = renderHook(() => useGroups())

        expect(result.current.groups).toEqual([])
        expect(result.current.selectedGroupId).toBeNull()
        expect(typeof result.current.setGroups).toBe('function')
        expect(typeof result.current.addGroup).toBe('function')
        expect(typeof result.current.updateGroup).toBe('function')
        expect(typeof result.current.removeGroup).toBe('function')
        expect(typeof result.current.setSelectedGroupId).toBe('function')
        })
    })
    
    // ============================================
    // Modal State
    // ============================================
    describe('Modal State', () => {
        it('has default modals object (empty)', () => {
        const { result } = renderHook(() => useStore((state) => state.modals))

        expect(result.current).toEqual({})
        })

        it('opens modal correctly', () => {
        const { result } = renderHook(() => useStore((state) => state.openModal))

        act(() => {
            result.current('createLink')
        })

        const isOpenResult = renderHook(() => useStore((state) => state.isModalOpen('createLink')))
        expect(isOpenResult.result.current).toBe(true)
        })

        it('closes modal correctly', () => {
        const { result: openResult } = renderHook(() => useStore((state) => state.openModal))
        const { result: closeResult } = renderHook(() => useStore((state) => state.closeModal))

        // Open modal first
        act(() => {
            openResult.current('createLink')
        })

        // Close modal
        act(() => {
            closeResult.current('createLink')
        })

        const isOpenResult = renderHook(() => useStore((state) => state.isModalOpen('createLink')))
        expect(isOpenResult.result.current).toBe(false)
        })

        it('isModalOpen returns false for non-existent modal', () => {
        const { result } = renderHook(() => useStore((state) => state.isModalOpen('nonExistent')))

        expect(result.current).toBe(false)
        })

        it('handles multiple modals independently', () => {
        const { result: openResult } = renderHook(() => useStore((state) => state.openModal))
        const { result: isOpenResult } = renderHook(() => useStore((state) => state.isModalOpen))

        act(() => {
            openResult.current('modal1')
            openResult.current('modal2')
        })

        expect(isOpenResult.current('modal1')).toBe(true)
        expect(isOpenResult.current('modal2')).toBe(true)
        expect(isOpenResult.current('modal3')).toBe(false)
        })

        it('useModals selector returns modal functions', () => {
        const { result } = renderHook(() => useModals())

        expect(typeof result.current.openModal).toBe('function')
        expect(typeof result.current.closeModal).toBe('function')
        expect(typeof result.current.isModalOpen).toBe('function')
        })
    })
})