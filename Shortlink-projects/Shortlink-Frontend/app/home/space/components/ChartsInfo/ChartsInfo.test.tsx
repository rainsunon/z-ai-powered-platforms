/// <reference types="jest" />
import React from 'react'
import { render, screen, fireEvent, act, within } from '@testing-library/react'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import ChartsInfo, { type ChartsInfoRef } from './ChartsInfo'
import type { AnalyticsResponse } from '@/src/api/types'

// Mock child components to keep ChartsInfo tests stable.
jest.mock('./components/TitleContent', () => ({
  __esModule: true,
  default: ({ title, children, titleButton }: any) => (
    <section data-testid="title-content">
      <div data-testid="title-content-title">{title}</div>
      <div data-testid="title-content-button">{titleButton}</div>
      <div data-testid="title-content-children">{children}</div>
    </section>
  ),
}))
jest.mock('./components/BarChart', () => ({
  __esModule: true,
  default: ({ chartData }: any) => <div data-testid="bar-chart" data-x={chartData?.xAxis?.length ?? 0} />,
}))
jest.mock('./components/KeyValue', () => ({
  __esModule: true,
  default: ({ dataLists }: any) => <div data-testid="key-value" data-items={dataLists?.length ?? 0} />,
}))
jest.mock('./components/ProgressLine', () => ({
  __esModule: true,
  default: ({ dataLists }: any) => <div data-testid="progress-line" data-items={dataLists?.length ?? 0} />,
}))
jest.mock('./components/ProgressPie', () => ({
  __esModule: true,
  default: ({ labels, data }: any) => (
    <div data-testid="progress-pie" data-labels={labels?.join('|') ?? ''} data-sum={(data ?? []).reduce((s: number, n: number) => s + n, 0)} />
  ),
}))
jest.mock('./components/LineChart', () => ({
  __esModule: true,
  default: ({ data }: any) => <div data-testid="line-chart" data-items={data?.length ?? 0} />,
}))

// Mock Ant Design components used here (Modal/Tabs/DatePicker/Table/Pagination/Button)
jest.mock('antd', () => { 
    const React = require('react')
    return {
        __esModule: true,
        Button: ({ children, onClick }: any) => (
            <button type="button" data-testid="antd-button" onClick={ onClick }>
                { children }
            </button>
        ), 
        Modal: ({ open, children, title, onCancel, 'data-testid': dataTestId }: any) => {
            if (!open) return null 
            return (
                <div data-testid={ dataTestId ?? 'antd-modal' }>
                    <div data-testid="modal-title">
                        {title}
                    </div>
                    <button type="button" data-testid="modal-class" onClick={ onCancel }>
                        Close
                    </button>
                    <div data-testid="modal-body">{ children }</div>
                </div>
            )
        }, 
        Tabs: ({ activeKey, onChange, items }: any) => (
            <div data-testid="antd-tabs">
                <div data-testid="tabs-header">
                    { items.map((it: any) => (
                        <button
                            type="button"
                            key={ it.key }
                            data-testid={ `tab-${it.key}` }
                            aria-selected={ activeKey === it.key }
                            onClick={ () => onChange(it.key)}
                        >
                            {it.label}
                        </button>
                    )) }                    
                </div>
                <div data-testid="tabs-content">{ items.find((it: any) => it.key === activeKey )?.children }</div>
            </div>
        ), 
        DatePicker: {
            RangePicker: ({ value, onChange }: any) => { 
                const emit = (dates: null | (Dayjs | null)[], dateStrings: any) => onChange?.(dates, dateStrings)
                return (
                    <div data-testid="range-picker">
                        <div data-testid="range-picker-value">
                            {value ? `${value[0]?.format('YYYY-MM-DD')},${value[1]?.format('YYYY-MM-DD')}` : 'null'}
                        </div>
                        <button
                            type="button"
                            data-testid="range-picker-set"
                            onClick={() => emit([dayjs('2024-01-01'), dayjs('2024-01-07')], ['2024-01-01', '2024-01-07'])}
                        >
                            SetRange
                        </button>
                        <button type="button" data-testid="range-picker-clear" onClick={ () => emit(null, [ '' ]) }>
                            Clear 
                        </button>
                    </div>
                )
            }, 
        },
        Table: ({ dataSource }: any) => (
            <div data-testid="antd-table" data-rows={(dataSource ?? []).length} />
        ),
        Pagination: ({ current, pageSize, total, onChange, onShowSizeChange }: any) => (
            <div data-testid="antd-pagination" data-current={current} data-size={pageSize} data-total={total}>
                <button type="button" data-testid="page-next" onClick={() => onChange?.(current + 1, pageSize)}>
                Next
                </button>
                <button type="button" data-testid="page-size-20" onClick={() => onShowSizeChange?.(current, 20)}>
                Size20
                </button>
            </div>
        ),
        Space: ({ children }: any) => <div data-testid="antd-space">{children}</div>,
    }
})

function makeInfo(): AnalyticsResponse {
    return {
        daily: [
        { date: '2024-01-01', pv: 10, uv: 5, uip: 3 },
        { date: '2024-01-02', pv: 20, uv: 9, uip: 6 },
        ],
        hourStats: Array(24).fill(0),
        weekdayStats: Array(7).fill(0),
        topIpStats: [{ ip: '127.0.0.1', cnt: 1 }],
        osStats: [{ os: 'Windows', cnt: 1, ratio: 1 }],
        browserStats: [{ browser: 'Chrome', cnt: 1, ratio: 1 }],
        uvTypeStats: [{ uvType: 'newUser', cnt: 2 }, { uvType: 'oldUser', cnt: 3 }],
        deviceStats: [{ device: 'Computer', cnt: 4 }, { device: 'Mobile', cnt: 5 }],
        networkStats: [{ device: 'WIFI', cnt: 6 }, { device: 'Mobile', cnt: 7 }],
        localeCnStats: [{ locale: '广东省', cnt: 10, ratio: 0.5 }],
    } as any
}

function makeTableInfo(total = 25) {
    return {
        data: {
        data: {
            total,
            records: [
            { id: 'log-1', createTime: '2024-01-01 00:00:00', ip: '127.0.0.1', locale: 'CN', browser: 'Chrome', os: 'Windows', device: 'PC', network: 'WIFI' },
            ],
        },
        },
    }
}


describe('ChartsInfo Component', () => {
  const openModal = (ref: React.RefObject<ChartsInfoRef>) => {
    act(() => {
      ref.current?.isVisible()
    })
  }

  const closeModal = (ref: React.RefObject<ChartsInfoRef>) => {
    act(() => {
      ref.current?.unVisible()
    })
  }

  it('is hidden by default', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)
    expect(screen.queryByTestId('modal-charts-info')).not.toBeInTheDocument()
  })

  it('opens when ref.isVisible() is called', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)

    openModal(ref)
    expect(screen.getByTestId('modal-charts-info')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('closes when ref.unVisible() is called', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)
    openModal(ref)
    expect(screen.getByTestId('modal-charts-info')).toBeInTheDocument()

    closeModal(ref)
    expect(screen.queryByTestId('modal-charts-info')).not.toBeInTheDocument()
  })

  it('shows group header when isGroup=true', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Group Analytics" isGroup nums={12} info={makeInfo()} tableInfo={makeTableInfo()} />)
    openModal(ref)

    expect(within(screen.getByTestId('modal-body')).getByText('Total: 12 short links')).toBeInTheDocument()
  })

  it('renders default tab Analytics', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)
    openModal(ref)

    expect(screen.getByTestId('tab-Analytics')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('antd-tabs')).toBeInTheDocument()
  })

  it('switches to History tab and renders table + pagination', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo(25)} />)
    openModal(ref)

    fireEvent.click(screen.getByTestId('tab-History'))
    expect(screen.getByTestId('tab-History')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('antd-table')).toBeInTheDocument()
    expect(screen.getByTestId('antd-pagination')).toBeInTheDocument()
  })

  it('calls onChangePage when pagination changes page/size', () => {
    const ref = React.createRef<ChartsInfoRef>()
    const onChangePage = jest.fn()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo(25)} onChangePage={onChangePage} />)
    openModal(ref)
    fireEvent.click(screen.getByTestId('tab-History'))

    fireEvent.click(screen.getByTestId('page-next'))
    expect(onChangePage).toHaveBeenCalledWith({ current: 2, size: 10 })

    fireEvent.click(screen.getByTestId('page-size-20'))
    expect(onChangePage).toHaveBeenCalledWith({ current: 2, size: 20 })
  })

  it('calls onChangeTime when date range changes', () => {
    const ref = React.createRef<ChartsInfoRef>()
    const onChangeTime = jest.fn()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} onChangeTime={onChangeTime} />)
    openModal(ref)

    fireEvent.click(screen.getByTestId('range-picker-set'))
    expect(onChangeTime).toHaveBeenCalledWith(['2024-01-01', '2024-01-07'])
  })

  it('calls onChangeTime(null) when date range is cleared', () => {
    const ref = React.createRef<ChartsInfoRef>()
    const onChangeTime = jest.fn()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} onChangeTime={onChangeTime} />)
    openModal(ref)

    fireEvent.click(screen.getByTestId('range-picker-clear'))
    expect(onChangeTime).toHaveBeenCalledWith(null)
  })

  it('toggles visit trends view between line and table', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)
    openModal(ref)

    // Default is line view
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.queryByTestId('antd-table')).not.toBeInTheDocument()

    // Click toggle button inside TitleContent
    const toggleButtons = screen.getAllByTestId('antd-button')
    fireEvent.click(toggleButtons[0])

    // Now table should render (line chart hidden inside first section)
    expect(screen.getByTestId('antd-table')).toBeInTheDocument()
  })

  it('renders key metrics totals from daily data', () => {
    const ref = React.createRef<ChartsInfoRef>()
    render(<ChartsInfo ref={ref} title="Analytics" info={makeInfo()} tableInfo={makeTableInfo()} />)
    openModal(ref)

    // totalPv=30, totalUv=14, totalUip=9
    const body = within(screen.getByTestId('modal-body'))
    expect(body.getByText('Page Views')).toBeInTheDocument()
    expect(body.getByText('Unique Visitors')).toBeInTheDocument()
    expect(body.getByText('Unique IPs')).toBeInTheDocument()
    expect(body.getByText('30')).toBeInTheDocument()
    expect(body.getByText('14')).toBeInTheDocument()
    expect(body.getByText('9')).toBeInTheDocument()
  })
})

