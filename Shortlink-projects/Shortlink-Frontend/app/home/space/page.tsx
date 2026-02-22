'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Dropdown,
  Popconfirm,
  Tooltip,
  Pagination,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  EditOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  VerticalAlignMiddleOutlined,
  PlusOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useGroups } from '@/src/store/useStore'
import {
  queryGroup,
  addGroup,
  editGroup,
  deleteGroup,
  sortGroup,
  queryGroupStats,
  queryGroupTable,
  queryPage,
  queryRecycleBin,
  toRecycleBin,
  recoverLink,
  removeLink,
  queryLinkStats,
  queryLinkTable,
} from '@/src/api'
import { useDomain } from '@/src/store/useStore'
import { getTodayFormatDate, getLastWeekFormatDate, truncateText, isSuccessCode } from '@/src/lib/utils'
import type { Group, ShortLink, AnalyticsResponse, PaginatedResponse } from '@/src/api/types'
import QRCode from './components/QRCode/QRCode'
import ChartsInfo, { type ChartsInfoRef } from './components/ChartsInfo/ChartsInfo'
import CreateLink from './components/CreateLink/CreateLink'
import CreateLinks from './components/CreateLinks/CreateLinks'
import EditLink from './components/EditLink/EditLink'
import styles from './space.module.css'

/**
 * My Space Page - Short Link Management
 * Route: /home/space
 * Matches Vue: views/mySpace/MySpaceIndex.vue
 */
export default function MySpacePage() {
  const { groups, setGroups, selectedGroupId, setSelectedGroupId } = useGroups()
  const { domain } = useDomain()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isRecycleBin, setIsRecycleBin] = useState(false)
  const [tableData, setTableData] = useState<ShortLink[]>([])
  const [loading, setLoading] = useState(false)
  const [totalNums, setTotalNums] = useState(0)
  const [recycleBinNums, setRecycleBinNums] = useState(0)

  // Pagination
  const [pageParams, setPageParams] = useState({
    gid: null as string | null,
    current: 1,
    size: 10, // Default page size - fixed to show 10 rows without scrolling
    orderTag: null as string | null,
  })

  // Modals
  const [isAddGroup, setIsAddGroup] = useState(false)
  const [isEditGroup, setIsEditGroup] = useState(false)
  const [isAddSmallLink, setIsAddSmallLink] = useState(false)
  const [isEditLink, setIsEditLink] = useState(false)
  const [isAddSmallLinks, setIsAddSmallLinks] = useState(false)
  const [editData, setEditData] = useState<ShortLink | null>(null)
  const [qrCodeVisible, setQrCodeVisible] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  
  // Charts info
  const chartsInfoRef = useRef<ChartsInfoRef>(null)
  const [chartsInfoTitle, setChartsInfoTitle] = useState('')
  const [chartsInfo, setChartsInfo] = useState<AnalyticsResponse | null>(null)
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [isGroupChart, setIsGroupChart] = useState(false)
  const [chartsNums, setChartsNums] = useState(0)
  const [chartsFavicon, setChartsFavicon] = useState<string>()
  const [chartsOriginUrl, setChartsOriginUrl] = useState<string>()
  const [tableFullShortUrl, setTableFullShortUrl] = useState<string>()
  const [tableGid, setTableGid] = useState<string>()

  // Forms
  const [groupForm] = Form.useForm()
  const [editGroupForm] = Form.useForm()

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load groups
  const loadGroups = useCallback(async (autoSelectNewGroup: boolean = false) => {
    try {
      const res = await queryGroup()
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Group API] Load groups response:', res)
      }
      
      // Backend Result format: { code: "0", message, data: Group[] }
      // res is already ApiResponse<Group[]>, so res.data is Group[]
      if (isSuccessCode(res.code)) {
        const groupList = Array.isArray(res.data) ? res.data : []
        // Reverse to show newest first (matching Vue behavior)
        const reversedList = [...groupList].reverse()
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Group API] Parsed group list:', reversedList)
        }
        
        setGroups(reversedList)
      
        // If autoSelectNewGroup is true, select the last group (newest)
        if (autoSelectNewGroup && reversedList.length > 0) {
          const newGroupIndex = reversedList.length - 1
          const newGroup = reversedList[newGroupIndex]
          
          if (newGroup?.gid) {
            setSelectedIndex(newGroupIndex)
            setSelectedGroupId(newGroup.gid)
            setIsRecycleBin(false)
            // Update page params - this will trigger useEffect to call loadTableData
            setPageParams((prev) => ({
              ...prev,
              gid: newGroup.gid || null,
              current: 1,
            }))
            // Note: loadTableData will be automatically called by useEffect when pageParams changes
          }
        } else if (reversedList.length > 0 && selectedIndex >= 0 && selectedIndex < reversedList.length) {
          // Keep current selection if valid
          setSelectedGroupId(reversedList[selectedIndex]?.gid || null)
          setPageParams((prev) => ({ ...prev, gid: reversedList[selectedIndex]?.gid || null }))
        } else if (reversedList.length > 0 && selectedIndex < 0) {
          // If no selection, select first group
          setSelectedIndex(0)
          setSelectedGroupId(reversedList[0]?.gid || null)
          setPageParams((prev) => ({ ...prev, gid: reversedList[0]?.gid || null }))
      }
      } else {
        console.error('[Group API] Failed to load groups:', res.message)
        message.error(res.message || 'Failed to load groups')
      }
    } catch (error: any) {
      console.error('[Group API] Load groups error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load groups'
      message.error(errorMessage)
    }
  }, [setGroups, setSelectedGroupId, selectedIndex])

  // Load table data
  const loadTableData = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {
        current: pageParams.current,
        size: pageParams.size,
        gid: pageParams.gid,
        enableStatus: 0,  // Only show active items (not deleted), exclude enableStatus === 1
      }
      if (pageParams.orderTag) {
        params.orderTag = pageParams.orderTag
      }

      const res = await queryPage(params)
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Table] Query page response:', res)
      }
      
      // Backend Result format: { code: "0", message, data: PaginatedResponse }
      if (isSuccessCode(res.code)) {
        // res.data is PaginatedResponse<ShortLink>
        // Backend returns: { start, page_size, total, elements }
        const paginatedData = res.data as PaginatedResponse<ShortLink>
        
        // Backend uses "elements" field, fallback to "records" or "list" for compatibility
        // Backend should already filter enableStatus === 0 (active items only)
        // But we add an extra filter as a safety measure
        const allData = paginatedData.elements || paginatedData.records || paginatedData.list || []
        const dataList = allData.filter((item: ShortLink) => item.enableStatus !== 1)
        
        if (process.env.NODE_ENV === 'development') {
          const deletedCount = allData.filter((item: ShortLink) => item.enableStatus === 1).length
          console.log('[Table] Parsed paginated data:', {
            elements: paginatedData.elements?.length,
            records: paginatedData.records?.length,
            list: paginatedData.list?.length,
            backendTotal: paginatedData.total,
            allDataLength: allData.length,
            filteredDataLength: dataList.length,
            deletedCount: deletedCount,
            note: deletedCount > 0 ? 'Warning: Backend returned deleted items, filtered out' : 'All items are active',
          })
        }
        
        setTableData(dataList)
        // Use backend total (should already exclude deleted items if backend filters correctly)
        // If backend doesn't filter, the count may be slightly off, but pagination should still work
        setTotalNums(Number(paginatedData.total) || dataList.length)
      } else {
        message.error(res.message || 'Failed to load data')
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [pageParams])

  // Load recycle bin
  const loadRecycleBin = useCallback(async () => {
    setLoading(true)
    try {
      // Collect all group IDs for gidList parameter
      const gidList = groups.map(group => group.gid).filter((gid): gid is string => !!gid)
      
      const res = await queryRecycleBin({
        gidList: gidList.length > 0 ? gidList : undefined,
        current: pageParams.current,
        size: pageParams.size,
      })
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Recycle Bin] Query response:', res)
      }
      
      // Backend returns: { code: "0", data: { elements, total, ... } }
      if (isSuccessCode(res.code)) {
        const paginatedData = res.data as PaginatedResponse<ShortLink>
        const dataList = paginatedData.elements || paginatedData.records || paginatedData.list || []
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Recycle Bin] Parsed data:', {
            elements: paginatedData.elements?.length,
            records: paginatedData.records?.length,
            list: paginatedData.list?.length,
            total: paginatedData.total,
            dataListLength: dataList.length,
          })
        }
        
        setTableData(dataList)
        const total = Number(paginatedData.total) || 0
        setTotalNums(total)
        setRecycleBinNums(total)
      } else {
        message.error(res.message || 'Failed to load recycle bin')
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to load recycle bin')
    } finally {
      setLoading(false)
    }
  }, [pageParams.current, pageParams.size, groups])

  useEffect(() => {
    loadGroups()
  }, [loadGroups])

  useEffect(() => {
    if (!isRecycleBin && selectedIndex !== -1) {
      loadTableData()
    } else if (isRecycleBin) {
      loadRecycleBin()
    }
  }, [isRecycleBin, selectedIndex, pageParams, loadTableData, loadRecycleBin])

  // Handle group selection
  const handleGroupSelect = (index: number) => {
    setSelectedIndex(index)
    setIsRecycleBin(false)
    if (groups[index]) {
      setSelectedGroupId(groups[index].gid || null)
      setPageParams((prev) => ({
        ...prev,
        gid: groups[index].gid || null,
        current: 1,
      }))
    }
  }

  // Handle recycle bin click
  const handleRecycleBin = () => {
    setIsRecycleBin(true)
    setSelectedIndex(-1)
    setSelectedGroupId(null)
    setPageParams((prev) => ({
      ...prev,
      gid: null,
      current: 1,
    }))
  }

  // Add group
  const handleAddGroup = async (values: { name: string }) => {
    try {
      const res = await addGroup({ name: values.name })
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Group API] Create group response:', res)
      }
      
      // Backend Result format: { code: "0" (string), message, data }
      // Use utility function to check success
      if (isSuccessCode(res.code)) {
        message.success('Group added successfully')
        setIsAddGroup(false)
        groupForm.resetFields()
        
        // Reload groups list and automatically select the newly created group
        // autoSelectNewGroup=true will select the last group (newest) and refresh table data
        await loadGroups(true)
      } else {
        message.error(res.message || 'Failed to add group')
      }
    } catch (error: any) {
      console.error('[Group API] Create group error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add group'
      message.error(errorMessage)
    }
  }

  // Edit group
  const handleEditGroup = async (values: { name: string }) => {
    try {
      const editGid = editGroupForm.getFieldValue('gid')
      const res = await editGroup({ id: editGid, name: values.name })
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Group API] Update group response:', res)
      }
      
      // Backend Result format: { code: "0" (string), message, data }
      // Use utility function to check success
      if (isSuccessCode(res.code)) {
        message.success('Group updated successfully')
        setIsEditGroup(false)
        editGroupForm.resetFields()
        await loadGroups()
      } else {
        message.error(res.message || 'Failed to update group')
      }
    } catch (error: any) {
      console.error('[Group API] Update group error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update group'
      message.error(errorMessage)
    }
  }

  // Delete group
  const handleDeleteGroup = async (gid: string) => {
    try {
      await deleteGroup({ id: gid })
      message.success('Group deleted successfully')
      setSelectedIndex(0)
      await loadGroups()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete group'
      message.error(errorMsg)
    }
  }

  // Show edit group modal
  const showEditGroup = (gid: string, name: string) => {
    editGroupForm.setFieldsValue({ gid, name })
    setIsEditGroup(true)
  }

  // Drag end handler
  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = groups.findIndex((g) => g.gid === active.id)
      const newIndex = groups.findIndex((g) => g.gid === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        // Update local state
        const newGroups = arrayMove(groups, oldIndex, newIndex)
        newGroups.forEach((group, index) => {
          group.sortOrder = index
        })
        setGroups(newGroups)

        // Update selected index
        if (selectedIndex === oldIndex) {
          setSelectedIndex(newIndex)
        } else if (oldIndex < newIndex && selectedIndex > oldIndex && selectedIndex <= newIndex) {
          setSelectedIndex(selectedIndex - 1)
        } else if (oldIndex > newIndex && selectedIndex < oldIndex && selectedIndex >= newIndex) {
          setSelectedIndex(selectedIndex + 1)
        }

        // Send to API
        try {
          await sortGroup(newGroups)
        } catch (error) {
          message.error('Failed to update group order')
          // Revert on error
          await loadGroups()
        }
      }
    }
  }

  // Move to recycle bin
  const handleMoveToRecycleBin = async (record: ShortLink) => {
    try {
      await toRecycleBin({
        id: record.id || '',
        gid: record.gid || '',
        fullShortUrl: record.fullShortUrl || '',
      })
      message.success('Moved to recycle bin')
      await loadTableData()
      await loadGroups()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete'
      message.error(errorMsg)
    }
  }

  // Restore from recycle bin
  const handleRestore = async (record: ShortLink) => {
    try {
      await recoverLink({
        id: record.id || '',
        gid: record.gid || '',
        fullShortUrl: record.fullShortUrl || '',
      })
      message.success('Restored successfully')
      await loadRecycleBin()
      await loadGroups()
    } catch (error: any) {
      message.error(error.message || 'Failed to restore')
    }
  }

  // Permanently delete
  const handlePermanentDelete = async (record: ShortLink) => {
    try {
      await removeLink({
        id: record.id || '',
        gid: record.gid || '',
        fullShortUrl: record.fullShortUrl || '',
      })
      message.success('Deleted permanently')
      await loadRecycleBin()
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete'
      message.error(errorMsg)
    }
  }

  // Copy URL
  const handleCopyUrl = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        message.success('Link copied!')
      })
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('Link copied!')
    }
  }

  // Check if expired
  const isExpired = (validDate?: string): boolean => {
    if (!validDate) return true
    const date = new Date(validDate).getTime()
    return new Date().getTime() < date
  }

  // Get image URL
  const getImgUrl = (url?: string): string => {
    return url || '/images/default-link-icon.png'
  }

  // Charts info state
  const statsFormData = {
    endDate: getTodayFormatDate(),
    startDate: getLastWeekFormatDate(),
    size: 10,
    current: 1,
  }

  // Show charts modal
  const chartsVisible = async (rowInfo: any, dateList?: [string, string]) => {
    setChartsInfoTitle(rowInfo?.describe || rowInfo?.name || '')
    const { fullShortUrl, gid, group, originUrl, favicon, enableStatus } = rowInfo
    setChartsOriginUrl(originUrl)
    setChartsFavicon(favicon)
    setIsGroupChart(!!group)
    setTableFullShortUrl(fullShortUrl)
    setTableGid(gid)
    setChartsNums(rowInfo?.shortLinkCount || 0)

    chartsInfoRef.current?.isVisible()

    // Prepare date range
    let startDate = statsFormData.startDate
    let endDate = statsFormData.endDate
    if (dateList) {
      startDate = dateList[0] + ' 00:00:00'
      endDate = dateList[1] + ' 23:59:59'
    } else {
      startDate = getLastWeekFormatDate() + ' 00:00:00'
      endDate = getTodayFormatDate() + ' 23:59:59'
    }

    try {
      let res: any = null
      let tableRes: any = null

      if (group) {
        res = await queryGroupStats({ ...statsFormData, fullShortUrl, gid, startDate, endDate })
        tableRes = await queryGroupTable({ gid, ...statsFormData, startDate, endDate })
      } else {
        res = await queryLinkStats({ ...statsFormData, fullShortUrl, gid, enableStatus, startDate, endDate })
        tableRes = await queryLinkTable({ gid, fullShortUrl, ...statsFormData, enableStatus, startDate, endDate })
      }

      const responseData = res.data as any
      setChartsInfo(responseData.data || responseData)
      setTableInfo(tableRes)
    } catch (error: any) {
      message.error(error.message || 'Failed to load chart data')
    }
  }

  // Handle time change in charts
  const handleChartsTimeChange = async (dateList: [string, string] | null) => {
    if (!dateList) return

    const startDate = dateList[0] + ' 00:00:00'
    const endDate = dateList[1] + ' 23:59:59'

    try {
      let res: any = null
      let tableRes: any = null

      if (isGroupChart) {
        res = await queryGroupStats({ ...statsFormData, fullShortUrl: tableFullShortUrl, gid: tableGid, startDate, endDate })
        tableRes = await queryGroupTable({ gid: tableGid, ...statsFormData, startDate, endDate })
      } else {
        res = await queryLinkStats({ ...statsFormData, fullShortUrl: tableFullShortUrl, gid: tableGid, startDate, endDate })
        tableRes = await queryLinkTable({ gid: tableGid, fullShortUrl: tableFullShortUrl, ...statsFormData, startDate, endDate })
      }

      const responseData = res.data as any
      setChartsInfo(responseData.data || responseData)
      setTableInfo(tableRes)
    } catch (error: any) {
      message.error(error.message || 'Failed to load chart data')
    }
  }

  // Handle page change in charts
  const handleChartsPageChange = async (page: { current: number; size: number }) => {
    const { current, size } = page
    statsFormData.current = current || 1
    statsFormData.size = size || 10

    try {
      let tableRes: any = null

      if (isGroupChart) {
        tableRes = await queryGroupTable({ gid: tableGid, ...statsFormData })
      } else {
        tableRes = await queryLinkTable({ gid: tableGid, fullShortUrl: tableFullShortUrl, ...statsFormData })
      }

      setTableInfo(tableRes)
    } catch (error: any) {
      message.error(error.message || 'Failed to load table data')
    }
  }

  // Table columns
  const columns: ColumnsType<ShortLink> = [
    {
      title: 'Short Link Info',
      dataIndex: 'describe',
      key: 'info',
      width: 300,
      render: (_, record) => (
        <div className={styles.tableLinkBox}>
          <img
            src={getImgUrl(record.favicon)}
            width={20}
            height={20}
            alt=""
            style={{ marginRight: '10px' }}
          />
          <div className={styles.nameDate}>
            <Tooltip title={record.describe}>
              <span>{truncateText(record.describe || '', 30)}</span>
            </Tooltip>
            <div className={styles.time}>
              <span>{record.createTime || record.createdAt}</span>
              {record.validDate && !isExpired(record.validDate) && (
                <Tooltip title={`Expires: ${record.validDate}`}>
                  <span className={styles.expiredBadge}>Expired</span>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Short Link URL',
      dataIndex: 'fullShortUrl',
      key: 'url',
      width: 300,
      render: (_, record) => {
        const fullUrl = record.fullShortUrl
          ? `http://${record.fullShortUrl}`
          : `${domain}/${record.shortUri || record.shortCode}`
        const isDisabled = record.validDateType === 1 && !isExpired(record.validDate)

        return (
          <div className={styles.tableUrlBox}>
            <a
              href={isDisabled ? undefined : fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.5 : 1 }}
            >
              {record.domain || domain}/{record.shortUri || record.shortCode}
            </a>
            <Tooltip title={record.originUrl || record.originalUrl}>
              <span>{truncateText(record.originUrl || record.originalUrl || '', 50)}</span>
            </Tooltip>
          </div>
        )
      },
    },
    {
      title: 'Copy',
      key: 'copy',
      width: 170,
      render: (_, record) => {
        const fullUrl = record.fullShortUrl
          ? `http://${record.fullShortUrl}`
          : `${domain}/${record.shortUri || record.shortCode}`

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="QR Code">
              <QrcodeOutlined
                className={styles.tableEdit}
                onClick={() => {
                  setQrCodeUrl(fullUrl)
                  setQrCodeVisible(true)
                }}
              />
            </Tooltip>
            <Tooltip title="Copy Link">
              <ShareAltOutlined
                className={styles.tableEdit}
                onClick={() => handleCopyUrl(fullUrl)}
              />
            </Tooltip>
          </div>
        )
      },
    },
    {
      title: 'Visits',
      key: 'visits',
      width: 120,
      render: (_, record) => (
        <div className={styles.timesBox}>
          <div className={styles.todayBox}>
            <span>Today</span>
            <span>{record.todayPv || 0}</span>
          </div>
          <div className={styles.totalBox}>
            <span>Total</span>
            <span>{record.totalPv || 0}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Visitors',
      key: 'visitors',
      width: 120,
      render: (_, record) => (
        <div className={styles.timesBox}>
          <div className={styles.todayBox}>
            <span>Today</span>
            <span>{record.todayUv || 0}</span>
          </div>
          <div className={styles.totalBox}>
            <span>Total</span>
            <span>{record.totalUv || 0}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'IP Count',
      key: 'ip',
      width: 120,
      render: (_, record) => (
        <div className={styles.timesBox}>
          <div className={styles.todayBox}>
            <span>Today</span>
            <span>{record.todayUip || 0}</span>
          </div>
          <div className={styles.totalBox}>
            <span>Total</span>
            <span>{record.totalUip || 0}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="View Charts">
            <BarChartOutlined
              className={styles.tableEdit}
              onClick={() => {
                chartsVisible(record)
              }}
            />
          </Tooltip>
          {!isRecycleBin && (
            <>
              <Tooltip title="Edit">
                <EditOutlined
                  className={styles.tableEdit}
                  onClick={() => {
                    setEditData(record)
                    setIsEditLink(true)
                  }}
                />
              </Tooltip>
              <Popconfirm
                title="Move to recycle bin?"
                onConfirm={() => handleMoveToRecycleBin(record)}
              >
                <Tooltip title="Delete">
                  <DeleteOutlined className={styles.tableEdit} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
          {isRecycleBin && (
            <>
              <Tooltip title="Restore">
                <Button
                  type="text"
                  icon={<span>↩</span>}
                  className={styles.tableEdit}
                  onClick={() => handleRestore(record)}
                />
              </Tooltip>
              <Popconfirm
                title="This is irreversible. Are you sure?"
                onConfirm={() => handlePermanentDelete(record)}
              >
                <Tooltip title="Delete Permanently">
                  <DeleteOutlined className={styles.tableEdit} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.optionTitle}>
          <div>
            Groups <span>({groups.length} total)</span>
          </div>
          <div className={`${styles.hoverBox} ${styles.addButton}`} onClick={() => setIsAddGroup(true)}>
            <PlusOutlined style={{ fontSize: '18px' }} />
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={groups.map((g) => g.gid || '')}
            strategy={verticalListSortingStrategy}
          >
            <ul className={styles.sortOptions}>
              {groups.map((group, index) => (
                <SortableGroupItem
                  key={group.gid}
                  group={group}
                  index={index}
                  isSelected={selectedIndex === index}
                  onClick={() => handleGroupSelect(index)}
                  onEdit={() => showEditGroup(group.gid || '', group.name)}
                  onDelete={() => handleDeleteGroup(group.gid || '')}
                  onChartsClick={() => chartsVisible({ describe: group.name, gid: group.gid, group: true, shortLinkCount: group.shortLinkCount })}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        {/* Recycle Bin */}
        <div className={styles.recycleBin}>
          <div
            className={`${styles.recycleBox} ${styles.hoverBox} ${
              selectedIndex === -1 ? styles.selectedItem : ''
            }`}
            onClick={handleRecycleBin}
          >
            <span className={styles.recycleBinText}>Recycle Bin</span>
            <DeleteOutlined className={styles.recycleBinIcon} style={{ marginLeft: '5px', fontSize: '20px' }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentBox}>
        <div className={styles.tableBox}>
          {!isRecycleBin && (
            <div className={styles.buttonsBox}>
              <Button
                type="primary"
                onClick={() => setIsAddSmallLink(true)}
                style={{ marginRight: '10px' }}
              >
                Create Link
              </Button>
              <Button onClick={() => setIsAddSmallLinks(true)} style={{ marginRight: '10px' }}>
                Batch Create
              </Button>
            </div>
          )}

          {isRecycleBin && (
            <div className={styles.recycleBinBox}>
              <span>Recycle Bin</span>
              <span>Total: {recycleBinNums} links</span>
            </div>
          )}

          <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey={(record) => record.id || record.fullShortUrl || ''}
            pagination={false}
              size="small"
          />
          </div>

          <div className={styles.paginationBlock}>
            <Pagination
              current={pageParams.current}
              pageSize={pageParams.size}
              total={totalNums}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={['5', '10', '15', '20', '30']}
              onChange={(page, size) => {
                setPageParams((prev) => ({ ...prev, current: page, size: size || 10 }))
              }}
              onShowSizeChange={(current, size) => {
                setPageParams((prev) => ({ ...prev, current: 1, size }))
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Group Modal */}
      <Modal
        title="Create Group"
        open={isAddGroup}
        onCancel={() => {
          setIsAddGroup(false)
          groupForm.resetFields()
        }}
        onOk={() => groupForm.submit()}
      >
        <Form form={groupForm} onFinish={handleAddGroup}>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        title="Edit Group"
        open={isEditGroup}
        onCancel={() => {
          setIsEditGroup(false)
          editGroupForm.resetFields()
        }}
        onOk={() => editGroupForm.submit()}
      >
        <Form form={editGroupForm} onFinish={handleEditGroup}>
          <Form.Item name="gid" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: 'Please enter group name' }]}
          >
            <Input placeholder="Enter group name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Link Modal */}
      <Modal
        title="Create Link"
        open={isAddSmallLink}
        onCancel={() => setIsAddSmallLink(false)}
        footer={null}
        width={800}
        data-testid="modal-create-link"
      >
        <CreateLink
          groupInfo={groups}
          isSingle={true}
          defaultGid={selectedGroupId || undefined}
          onSubmit={() => {
            setIsAddSmallLink(false)
            loadTableData()
          }}
          onCancel={() => setIsAddSmallLink(false)}
        />
      </Modal>

      {/* Batch Create Links Modal */}
      <Modal
        title="Batch Create Links"
        open={isAddSmallLinks}
        onCancel={() => setIsAddSmallLinks(false)}
        footer={null}
        width={800}
        data-testid="modal-create-links"
      >
        <CreateLinks
          groupInfo={groups}
          defaultGid={selectedGroupId || undefined}
          onSubmit={() => {
            setIsAddSmallLinks(false)
            loadTableData()
          }}
          onCancel={() => setIsAddSmallLinks(false)}
        />
      </Modal>

      {/* Edit Link Modal */}
      <Modal
        title="Edit Link"
        open={isEditLink}
        onCancel={() => {
          setIsEditLink(false)
          setEditData(null)
        }}
        footer={null}
        width={800}
        data-testid="modal-edit-link"
      >
        {editData && (
          <EditLink
            groupInfo={groups}
            editData={editData}
            onSubmit={() => {
              setIsEditLink(false)
              setEditData(null)
              loadTableData()
            }}
            onCancel={() => {
              setIsEditLink(false)
              setEditData(null)
            }}
            onUpdatePage={() => {
              loadTableData()
              loadGroups()
            }}
          />
        )}
      </Modal>

      {/* QR Code Modal */}
      <QRCode
        url={qrCodeUrl}
        visible={qrCodeVisible}
        onClose={() => setQrCodeVisible(false)}
      />

      {/* Charts Info Modal */}
      <ChartsInfo
        ref={chartsInfoRef}
        title={chartsInfoTitle}
        info={chartsInfo || undefined}
        tableInfo={tableInfo}
        isGroup={isGroupChart}
        nums={chartsNums}
        favicon={chartsFavicon}
        originUrl={chartsOriginUrl}
        onChangeTime={handleChartsTimeChange}
        onChangePage={handleChartsPageChange}
      />
    </div>
  )
}

// Sortable Group Item Component
function SortableGroupItem({
  group,
  index,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onChartsClick,
}: {
  group: Group
  index: number
  isSelected: boolean
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onChartsClick?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.gid || '',
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const menuItems = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: onEdit,
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: onDelete,
      danger: true,
    },
  ]

  return (
    <li ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`${styles.itemBox} ${isSelected ? styles.selectedItem : ''} ${styles.hoverBox}`}
        onClick={onClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div {...listeners} style={{ cursor: 'grab', marginRight: '5px' }}>
            <VerticalAlignMiddleOutlined style={{ fontSize: '13px' }} />
          </div>
          <span className={styles.overText} title={group.name}>
            {truncateText(group.name, 15)}
          </span>
        </div>
        <div className={styles.flexBox}>
          {group.shortLinkCount !== 0 && group.shortLinkCount !== null && (
            <Tooltip title="View Charts">
              <BarChartOutlined
                className={styles.edit}
                onClick={(e) => {
                  e.stopPropagation()
                  onChartsClick?.()
                }}
              />
            </Tooltip>
          )}
          {group.title !== 'Default Group' && (
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <EditOutlined
                className={styles.edit}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
            </Dropdown>
          )}
          <span className={styles.itemLength}>{group.shortLinkCount ?? 0}</span>
        </div>
      </div>
    </li>
  )
}
