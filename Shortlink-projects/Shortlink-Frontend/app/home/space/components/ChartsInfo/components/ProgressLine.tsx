'use client'

import { Progress } from 'antd'
import styles from './ProgressLine.module.css'

interface ProgressLineProps {
  dataLists?: Array<{
    os?: string
    browser?: string
    name?: string
    cnt?: number
    ratio?: number
  }>
  style?: React.CSSProperties
}

/**
 * ProgressLine Component
 * Displays progress bars for OS/Browser stats with icons
 * Matches Vue: views/mySpace/components/chartsInfo/ProgressLine.vue
 */
export default function ProgressLine({ dataLists = [], style }: ProgressLineProps) {
  if (!dataLists || dataLists.length === 0) {
    return (
      <div style={{ ...style, padding: '20px', textAlign: 'center', color: '#999' }}>
        No access data for selected date range
      </div>
    )
  }

  // Get icon URL helper (simplified - would need actual image assets)
  const getIconUrl = (browser?: string, os?: string): string => {
    const browserLower = browser?.toLowerCase() || ''
    const osLower = os?.toLowerCase() || ''
    
    if (browserLower.includes('edge') || osLower.includes('edge')) {
      return '/images/browsers/edge.png'
    } else if (browserLower.includes('chrome') || osLower.includes('chrome')) {
      return '/images/browsers/chrome.png'
    } else if (browserLower.includes('android') || osLower.includes('android')) {
      return '/images/os/android.png'
    } else if (browserLower.includes('fire') || osLower.includes('fire')) {
      return '/images/browsers/firefox.png'
    } else if (browserLower.includes('ios') || osLower.includes('ios')) {
      return '/images/os/ios.png'
    } else if (browserLower.includes('mac') || osLower.includes('mac')) {
      return '/images/os/macos.png'
    } else if (browserLower.includes('safari') || osLower.includes('safari')) {
      return '/images/browsers/safari.png'
    } else if (browserLower.includes('windows') || osLower.includes('windows')) {
      return '/images/os/windows.png'
    } else if (browserLower.includes('opera') || osLower.includes('opera')) {
      return '/images/browsers/opera.png'
    } else if (browserLower.includes('internet') || osLower.includes('internet')) {
      return '/images/browsers/ie.png'
    } else if (browserLower.includes('wechat') || browserLower.includes('微信') || osLower.includes('wechat')) {
      return '/images/browsers/wechat.png'
    } else if (browserLower.includes('linux') || osLower.includes('linux')) {
      return '/images/os/linux.png'
    }
    return '/images/browsers/other.png'
  }

  return (
    <div className={styles.mainBox} style={style}>
      {dataLists.map((item, index) => {
        const name = item.os || item.browser || item.name || `Item ${index + 1}`
        const value = item.cnt || 0
        const ratio = item.ratio || 0
        const percent = ratio * 100

        return (
          <div key={index} className={styles.flexBox}>
            <div className={styles.flexItem}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={getIconUrl(item.browser, item.os)} 
                  width={25} 
                  height={25}
                  alt=""
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span>
                  {name} {percent.toFixed(2)}%
                </span>
              </div>
              <div>
                <span>{value} visits</span>
              </div>
            </div>
            <div>
              <Progress
                percent={percent}
                showInfo={false}
                strokeColor="#3464e0"
                strokeWidth={12}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
