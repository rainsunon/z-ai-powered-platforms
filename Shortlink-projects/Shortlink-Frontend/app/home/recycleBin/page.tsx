'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Button,
  message,
  Popconfirm,
  Tooltip,
  Pagination,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  DeleteOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  QrcodeOutlined,
  RollbackOutlined,
} from '@ant-design/icons'
import { queryRecycleBin, recoverLink, removeLink } from '@/src/api'
import { useDomain } from '@/src/store/useStore'
import { truncateText } from '@/src/lib/utils'
import type { ShortLink } from '@/src/api/types'
import styles from './recycleBin.module.css'

/**
 * Recycle Bin Page
 * Route: /home/recycleBin
 * Matches Vue: views/recycleBin/RecycleBinIndex.vue
 */
export default function RecycleBinPage() {
  const { domain } = useDomain()
  const [tableData, setTableData] = useState<ShortLink[]>([])
  const [loading, setLoading] = useState(false)
  const [totalNums, setTotalNums] = useState(0)

  // Pagination
  const [pageParams, setPageParams] = useState({
    current: 1,
    size: 15,
  })

  // Load recycle bin data
  const loadRecycleBin = useCallback(async () => {
    setLoading(true)
    try {
      const res = await queryRecycleBin({
        current: pageParams.current,
        size: pageParams.size,
      })
      const responseData = res.data as any
      
      setTableData(responseData.data?.records || responseData.data?.list || [])
      setTotalNums(Number(responseData.data?.total) || 0)
    } catch (error: any) {
      message.error(error.message || 'Failed to load recycle bin')
    } finally {
      setLoading(false)
    }
  }, [pageParams.current, pageParams.size])

  useEffect(() => {
    loadRecycleBin()
  }, [loadRecycleBin])

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
                  // TODO: Show QR code modal
                  message.info('QR code feature coming soon')
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
                // TODO: Show charts modal
                message.info('Charts feature coming soon')
              }}
            />
          </Tooltip>
          <Tooltip title="Restore">
            <RollbackOutlined
              className={styles.tableEdit}
              onClick={() => handleRestore(record)}
            />
          </Tooltip>
          <Popconfirm
            title="This is irreversible. Are you sure?"
            description="Deleting permanently will make the short link invalid and stop data statistics."
            onConfirm={() => handlePermanentDelete(record)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Permanently">
              <DeleteOutlined className={styles.tableEdit} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Recycle Bin</h2>
        <span>Total: {totalNums} deleted links</span>
      </div>

      <div className={styles.tableBox}>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey={(record) => record.id || record.fullShortUrl || ''}
          pagination={false}
          scroll={{ y: 'calc(100vh - 300px)' }}
        />

        <div className={styles.paginationBlock}>
          <Pagination
            current={pageParams.current}
            pageSize={pageParams.size}
            total={totalNums}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={['10', '15', '20', '30']}
            onChange={(page, size) => {
              setPageParams({ current: page, size: size || 15 })
            }}
            onShowSizeChange={(current, size) => {
              setPageParams({ current: 1, size })
            }}
          />
        </div>
      </div>
    </div>
  )
}
