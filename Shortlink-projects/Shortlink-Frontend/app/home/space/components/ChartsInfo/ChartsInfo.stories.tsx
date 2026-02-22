import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { Button } from 'antd'
import ChartsInfo from './ChartsInfo'
import type { AnalyticsResponse } from '@/src/api/types'

// Mock analytics data
const mockAnalyticsData: AnalyticsResponse = {
  totalVisits: 1234,
  todayVisits: 56,
  daily: [
    { date: '2024-01-01', pv: 100, uv: 80, uip: 70 },
    { date: '2024-01-02', pv: 120, uv: 90, uip: 75 },
    { date: '2024-01-03', pv: 150, uv: 110, uip: 85 },
    { date: '2024-01-04', pv: 180, uv: 130, uip: 95 },
    { date: '2024-01-05', pv: 200, uv: 150, uip: 105 },
    { date: '2024-01-06', pv: 220, uv: 170, uip: 115 },
    { date: '2024-01-07', pv: 264, uv: 200, uip: 125 },
  ],
  hourStats: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
  weekdayStats: [100, 120, 140, 160, 180, 200, 220],
  localeCnStats: [
    { locale: 'CN', cnt: 500, ratio: 0.4 },
    { locale: 'US', cnt: 300, ratio: 0.24 },
    { locale: 'JP', cnt: 200, ratio: 0.16 },
    { locale: 'KR', cnt: 100, ratio: 0.08 },
    { locale: 'Other', cnt: 134, ratio: 0.12 },
  ],
  topIpStats: [
    { ip: '192.168.1.1', cnt: 50 },
    { ip: '192.168.1.2', cnt: 40 },
    { ip: '192.168.1.3', cnt: 30 },
  ],
  osStats: [
    { os: 'Windows', cnt: 400 },
    { os: 'macOS', cnt: 300 },
    { os: 'Linux', cnt: 200 },
    { os: 'iOS', cnt: 200 },
    { os: 'Android', cnt: 134 },
  ],
  browserStats: [
    { browser: 'Chrome', cnt: 600 },
    { browser: 'Safari', cnt: 300 },
    { browser: 'Firefox', cnt: 200 },
    { browser: 'Edge', cnt: 134 },
  ],
  uvTypeStats: [
    { uvType: 'newUser', cnt: 600 },
    { uvType: 'oldUser', cnt: 634 },
  ],
  deviceStats: [
    { device: 'Desktop', cnt: 700 },
    { device: 'Mobile', cnt: 400 },
    { device: 'Tablet', cnt: 134 },
  ],
  networkStats: [
    { device: 'WiFi', cnt: 800 },
    { device: '4G', cnt: 300 },
    { device: '5G', cnt: 134 },
  ],
}

const mockTableInfo = {
  list: [
    {
      id: '1',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      referer: 'https://example.com',
      accessedAt: '2024-01-07T10:00:00Z',
      locale: 'CN',
      device: 'Desktop',
      browser: 'Chrome',
      os: 'Windows',
    },
    {
      id: '2',
      ip: '192.168.1.2',
      userAgent: 'Mozilla/5.0...',
      referer: 'https://example.com',
      accessedAt: '2024-01-07T11:00:00Z',
      locale: 'US',
      device: 'Mobile',
      browser: 'Safari',
      os: 'iOS',
    },
  ],
  total: 2,
  current: 1,
  size: 10,
}

const meta: Meta<typeof ChartsInfo> = {
  title: 'Components/ChartsInfo',
  component: ChartsInfo,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ChartsInfo>

// Wrapper component to manage modal state
const ChartsInfoWrapper = (args: any) => {
  const chartsInfoRef = useRef<any>(null)
  return (
    <>
      <Button onClick={() => chartsInfoRef.current?.isVisible()}>Show Analytics</Button>
      <ChartsInfo {...args} ref={chartsInfoRef} />
    </>
  )
}

export const Default: Story = {
  render: (args) => <ChartsInfoWrapper {...args} />,
  args: {
    title: 'Link Analytics',
    info: mockAnalyticsData,
    tableInfo: mockTableInfo,
    isGroup: false,
    nums: 1234,
    favicon: 'https://example.com/favicon.ico',
    originUrl: 'https://example.com/original-url',
    onChangeTime: (dateList) => {
      console.log('Date range changed:', dateList)
    },
    onChangePage: (page) => {
      console.log('Page changed:', page)
    },
  },
}

export const GroupAnalytics: Story = {
  render: (args) => <ChartsInfoWrapper {...args} />,
  args: {
    title: 'Group Analytics',
    info: mockAnalyticsData,
    tableInfo: mockTableInfo,
    isGroup: true,
    nums: 5678,
    onChangeTime: (dateList) => {
      console.log('Date range changed:', dateList)
    },
    onChangePage: (page) => {
      console.log('Page changed:', page)
    },
  },
}

export const EmptyData: Story = {
  render: (args) => <ChartsInfoWrapper {...args} />,
  args: {
    title: 'Link Analytics',
    info: {
      totalVisits: 0,
      todayVisits: 0,
      daily: [],
    },
    tableInfo: {
      list: [],
      total: 0,
      current: 1,
      size: 10,
    },
    isGroup: false,
    nums: 0,
    onChangeTime: (dateList) => {
      console.log('Date range changed:', dateList)
    },
    onChangePage: (page) => {
      console.log('Page changed:', page)
    },
  },
}
