'use client'

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Modal, Tabs, DatePicker, Button, Table, Pagination, Space } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { getTodayFormatDate, getLastWeekFormatDate } from '@/src/lib/utils'
import TitleContent from './components/TitleContent'
import BarChart from './components/BarChart'
import KeyValue from './components/KeyValue'
import ProgressLine from './components/ProgressLine'
import ProgressPie from './components/ProgressPie'
import LineChart from './components/LineChart'
import type { AnalyticsResponse, AccessLog } from '@/src/api/types'
import styles from './ChartsInfo.module.css'

const { RangePicker } = DatePicker

interface ChartsInfoProps {
  title: string
  info?: AnalyticsResponse
  tableInfo?: any
  isGroup?: boolean
  nums?: number
  favicon?: string
  originUrl?: string
  onChangeTime?: (dateList: [string, string] | null) => void
  onChangePage?: (page: { current: number; size: number }) => void
}

export interface ChartsInfoRef {
  isVisible: () => void
  unVisible: () => void
}

/**
 * ChartsInfo Component
 * Analytics modal with charts and access logs
 * Matches Vue: views/mySpace/components/chartsInfo/ChartsInfo.vue
 */
const ChartsInfo = forwardRef<ChartsInfoRef, ChartsInfoProps>(
  ({ title, info, tableInfo, isGroup = false, nums = 0, favicon, originUrl, onChangeTime, onChangePage }, ref) => {
    const [visible, setVisible] = useState(false)
    const [activeTab, setActiveTab] = useState('Analytics')
    const [dateValue, setDateValue] = useState<[Dayjs, Dayjs] | null>([
      dayjs(getLastWeekFormatDate()),
      dayjs(getTodayFormatDate()),
    ])
    const [isLine, setIsLine] = useState(true)
    const [pageParams, setPageParams] = useState({ current: 1, size: 10 })

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      isVisible: () => setVisible(true),
      unVisible: () => setVisible(false),
    }))

    // Handle date change
    const handleDateChange = (
      dates: null | (Dayjs | null)[],
      dateStrings: [string, string] | [string]
    ) => {
      if (dates && Array.isArray(dates) && dates.length === 2 && dates[0] && dates[1]) {
        setDateValue([dates[0], dates[1]])
        if (onChangeTime && dateStrings.length === 2) {
          onChangeTime([dateStrings[0], dateStrings[1]])
        }
      } else {
        setDateValue(null)
        if (onChangeTime) {
          onChangeTime(null)
        }
      }
    }

    // Date shortcuts
    const shortcuts: RangePickerProps['presets'] = [
      {
        label: 'Today',
        value: [dayjs(), dayjs()],
      },
      {
        label: 'Yesterday',
        value: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
      },
      {
        label: 'Last 7 Days',
        value: [dayjs().subtract(7, 'day'), dayjs()],
      },
      {
        label: 'Last 30 Days',
        value: [dayjs().subtract(30, 'day'), dayjs()],
      },
    ]

    // Handle close
    const handleClose = () => {
      setDateValue([dayjs(getLastWeekFormatDate()), dayjs(getTodayFormatDate())])
      setVisible(false)
      setActiveTab('Analytics')
      setPageParams({ current: 1, size: 10 })
    }

    // Calculate totals
    const totalPv = info?.daily?.reduce((sum, item) => sum + item.pv, 0) || 0
    const totalUv = info?.daily?.reduce((sum, item) => sum + item.uv, 0) || 0
    const totalUip = info?.daily?.reduce((sum, item) => sum + item.uip, 0) || 0

    // Format daily data for line chart
    const lineChartData = info?.daily?.map((item) => {
      const dateParts = item.date.split('-')
      const formattedDate = `${dateParts[1]}/${dateParts[2]}`
      return {
        date: formattedDate,
        pv: item.pv,
        uv: item.uv,
        uip: item.uip,
      }
    }) || []

    // Transform data for pie charts
    const userTypeList = [0, 0]
    info?.uvTypeStats?.forEach((item) => {
      if (item.uvType === 'newUser') {
        userTypeList[0] = item.cnt
      } else if (item.uvType === 'oldUser') {
        userTypeList[1] = item.cnt
      }
    })

    const deviceList = [0, 0]
    info?.deviceStats?.forEach((item) => {
      if (item.device === 'Mobile') {
        deviceList[1] = item.cnt
      } else {
        deviceList[0] = item.cnt
      }
    })

    const netWorkList = [0, 0]
    info?.networkStats?.forEach((item) => {
      if (item.device === 'Mobile') {
        netWorkList[1] = item.cnt
      } else {
        netWorkList[0] = item.cnt
      }
    })

    // Format China map data
    const chinaMapData = info?.localeCnStats?.map((item) => {
      let locale = item.locale.replace('省', '').replace('市', '')
      return {
        name: locale,
        value: item.cnt,
        ratio: item.ratio,
      }
    }) || []

    // Access log table columns
    const accessLogColumns = [
      {
        title: 'Access Time',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
      },
      {
        title: 'Access IP',
        dataIndex: 'ip',
        key: 'ip',
        width: 140,
      },
      {
        title: 'Visitor Region',
        dataIndex: 'locale',
        key: 'locale',
      },
      {
        title: 'Device Info',
        key: 'device',
        render: (_: any, record: AccessLog) => (
          <Space>
            <span title={record.browser || ''}>🌐</span>
            <span title={record.os || ''}>💻</span>
            <span title={record.device || ''}>📱</span>
            <span title={record.network || ''}>📶</span>
          </Space>
        ),
      },
      ...(isGroup ? [] : [{
        title: 'Visitor Type',
        dataIndex: 'uvType',
        key: 'uvType',
      }]),
    ]

    // Handle pagination
    const handlePageChange = (page: number, size: number) => {
      setPageParams({ current: page, size })
      if (onChangePage) {
        onChangePage({ current: page, size })
      }
    }

    const totalNums = tableInfo?.data?.data?.total || 0
    const accessLogs = tableInfo?.data?.data?.records || []

    // Get image URL helper
    const getImgUrl = (url?: string) => {
      return url || '/images/default-link-icon.png'
    }

    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isGroup && favicon && (
              <img src={getImgUrl(favicon)} width={25} height={25} alt="" />
            )}
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{title}</div>
              {!isGroup && originUrl && (
                <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>{originUrl}</div>
              )}
            </div>
          </div>
        }
        open={visible}
        onCancel={handleClose}
        footer={null}
        width="90%"
        style={{ top: 60 }}
        data-testid="modal-charts-info"
      >
        {isGroup && (
          <div style={{ marginBottom: '10px', color: '#666' }}>
            Total: {nums} short links
          </div>
        )}

        <div style={{ position: 'absolute', right: 30, top: 60, zIndex: 999 }}>
          <RangePicker
            value={dateValue}
            onChange={handleDateChange}
            presets={shortcuts}
            format="YYYY-MM-DD"
            allowClear
          />
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'Analytics',
              label: 'Analytics',
              children: (
                <div className={styles.contentBox}>
                  {/* Visit Trends */}
                  <TitleContent
                    className={styles.chartItem}
                    style={{ width: '800px' }}
                    title="Visit Trends"
                    titleButton={
                      <Button size="small" onClick={() => setIsLine(!isLine)}>
                        {isLine ? 'Switch to Table' : 'Switch to Line'}
                      </Button>
                    }
                  >
                    {isLine ? (
                      <div className={styles.listChart}>
                        <div className={styles.top10}>
                          <div className={styles.keyValue}>
                            <span>Page Views</span>
                            <span>{totalPv}</span>
                          </div>
                          <div className={styles.keyValue}>
                            <span>Unique Visitors</span>
                            <span>{totalUv}</span>
                          </div>
                          <div className={styles.keyValue}>
                            <span>Unique IPs</span>
                            <span>{totalUip}</span>
                          </div>
                        </div>
                        <div className={styles.lineChart}>
                          <LineChart data={lineChartData} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: '20px' }}>
                        <Table
                          dataSource={lineChartData}
                          columns={[
                            { title: 'Date', dataIndex: 'date', key: 'date', width: 160 },
                            { title: 'Page Views', dataIndex: 'pv', key: 'pv', width: 160 },
                            { title: 'Unique Visitors', dataIndex: 'uv', key: 'uv', width: 160 },
                            { title: 'Unique IPs', dataIndex: 'uip', key: 'uip', width: 160 },
                          ]}
                          pagination={false}
                          size="small"
                        />
                      </div>
                    )}
                  </TitleContent>

                  {/* 24 Hour Distribution */}
                  <TitleContent className={styles.chartItem} title="24 Hour Distribution" style={{ width: '800px' }}>
                    <BarChart
                      chartData={{
                        xAxis: Array.from({ length: 24 }, (_, i) => i),
                        value: info?.hourStats || Array(24).fill(0),
                      }}
                    />
                  </TitleContent>

                  {/* Note: China/World maps removed - would require ECharts or map library */}
                  {/* Visit Region (simplified) */}
                  {chinaMapData.length > 0 && (
                    <TitleContent className={styles.chartItem} title="Top 10 Regions" style={{ width: '390px' }}>
                      <div style={{ padding: '10px', maxHeight: '270px', overflowY: 'auto' }}>
                        {chinaMapData.slice(0, 10).map((item, index) => (
                          <div key={index} className={styles.keyValue}>
                            <span>{index + 1}. {item.name}</span>
                            <span>{(item.ratio * 100).toFixed(2)}%</span>
                            <span>{item.value} visits</span>
                          </div>
                        ))}
                      </div>
                    </TitleContent>
                  )}

                  {/* Top IPs */}
                  <TitleContent className={styles.chartItem} title="Top IPs" style={{ width: '390px' }}>
                    <KeyValue dataLists={info?.topIpStats} />
                  </TitleContent>

                  {/* Weekly Distribution */}
                  <TitleContent className={styles.chartItem} title="Weekly Distribution" style={{ width: '390px' }}>
                    <BarChart
                      chartData={{
                        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        value: info?.weekdayStats || Array(7).fill(0),
                      }}
                    />
                  </TitleContent>

                  {/* Operating System */}
                  <TitleContent className={styles.chartItem} title="Operating System" style={{ width: '390px' }}>
                    <ProgressLine dataLists={info?.osStats} />
                  </TitleContent>

                  {/* Browser */}
                  <TitleContent className={styles.chartItem} title="Browser" style={{ width: '390px' }}>
                    <ProgressLine dataLists={info?.browserStats} />
                  </TitleContent>

                  {/* Visitor Type */}
                  {!isGroup && (
                    <TitleContent className={styles.chartItem} title="Visitor Type" style={{ width: '390px' }}>
                      <ProgressPie labels={['New Visitors', 'Returning Visitors']} data={userTypeList} />
                    </TitleContent>
                  )}

                  {/* Network Type */}
                  <TitleContent className={styles.chartItem} title="Network Type" style={{ width: '390px' }}>
                    <ProgressPie labels={['WIFI', 'Mobile Data']} data={netWorkList} />
                  </TitleContent>

                  {/* Device Type */}
                  <TitleContent className={styles.chartItem} title="Device Type" style={{ width: '390px' }}>
                    <ProgressPie labels={['Computer', 'Mobile Device']} data={deviceList} />
                  </TitleContent>
                </div>
              ),
            },
            {
              key: 'History',
              label: 'History',
              children: (
                <div>
                  <Table
                    dataSource={accessLogs}
                    columns={accessLogColumns}
                    rowKey={(record, index) => record.id || `log-${index}`}
                    pagination={false}
                    scroll={{ y: 'calc(100vh - 400px)' }}
                  />
                  <div className={styles.paginationBlock}>
                    <Pagination
                      current={pageParams.current}
                      pageSize={pageParams.size}
                      total={totalNums}
                      showSizeChanger
                      showQuickJumper
                      pageSizeOptions={['10', '15', '20', '30']}
                      onChange={handlePageChange}
                      onShowSizeChange={handlePageChange}
                    />
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Modal>
    )
  }
)

ChartsInfo.displayName = 'ChartsInfo'

export default ChartsInfo
