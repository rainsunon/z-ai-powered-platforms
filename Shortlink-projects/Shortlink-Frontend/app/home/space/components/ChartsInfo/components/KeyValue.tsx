'use client'

interface KeyValueProps {
  dataLists?: Array<{
    ip?: string
    name?: string
    cnt?: number
    value?: number
  }>
  style?: React.CSSProperties
}

/**
 * KeyValue Component
 * Displays key-value pairs in a list
 * Matches Vue: views/mySpace/components/chartsInfo/KeyValue.vue
 */
export default function KeyValue({ dataLists = [], style }: KeyValueProps) {
  if (!dataLists || dataLists.length === 0) {
    return (
      <div style={{ ...style, padding: '20px', textAlign: 'center', color: '#999' }}>
        No data available
      </div>
    )
  }

  return (
    <div style={{ ...style, padding: '10px' }}>
      {dataLists.slice(0, 10).map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderBottom: index < dataLists.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}
        >
          <span style={{ fontSize: '14px', color: '#333' }}>
            {item.ip || item.name || `Item ${index + 1}`}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#3464e0' }}>
            {item.cnt || item.value || 0}
          </span>
        </div>
      ))}
    </div>
  )
}
