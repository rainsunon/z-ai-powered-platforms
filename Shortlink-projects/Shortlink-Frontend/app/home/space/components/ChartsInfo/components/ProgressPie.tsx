'use client'

import { Progress } from 'antd'
import { useEffect, useState } from 'react'

interface ProgressPieProps {
  labels: string[]
  data: number[]
  style?: React.CSSProperties
}

/**
 * ProgressPie Component
 * Displays circular progress indicators (not pie chart)
 * Matches Vue: views/mySpace/components/chartsInfo/ProgressPie.vue
 */
export default function ProgressPie({ labels, data, style }: ProgressPieProps) {
  const [data1Percentage, setData1Percentage] = useState(0)
  const [data2Percentage, setData2Percentage] = useState(0)

  useEffect(() => {
    const data1 = data[0] || 0
    const data2 = data[1] || 0
    const total = data1 + data2

    if (data1 === 0) {
      setData1Percentage(0)
    } else {
      setData1Percentage(Number(((data1 / total) * 100).toFixed(0)))
    }

    if (data2 === 0) {
      setData2Percentage(0)
    } else {
      setData2Percentage(Number(((data2 / total) * 100).toFixed(0)))
    }
  }, [data])

  const data1 = data[0] || 0
  const data2 = data[1] || 0
  const label1 = labels[0] || 'Data 1'
  const label2 = labels[1] || 'Data 2'
  const unit1 = label1 === 'New Visitors' ? 'visitors' : 'visits'
  const unit2 = label2 === 'Returning Visitors' ? 'visitors' : 'visits'

  return (
    <div style={{ ...style, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Progress
          type="circle"
          percent={data1Percentage}
          strokeColor="#3464e0"
          strokeWidth={10}
          format={() => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ marginBottom: '5px' }}>
                {label1}: {data1Percentage}%
              </span>
              <span>
                {data1} {unit1}
              </span>
            </div>
          )}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Progress
          type="circle"
          percent={data2Percentage}
          strokeColor="#3464e0"
          strokeWidth={10}
          format={() => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', fontWeight: 600 }}>
              <span style={{ marginBottom: '5px' }}>
                {label2}: {data2Percentage}%
              </span>
              <span>
                {data2} {unit2}
              </span>
            </div>
          )}
        />
      </div>
    </div>
  )
}
