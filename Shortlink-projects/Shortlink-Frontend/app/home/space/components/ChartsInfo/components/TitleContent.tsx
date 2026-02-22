'use client'

import { ReactNode, useEffect } from 'react'
import styles from './TitleContent.module.css'

interface TitleContentProps {
  title: string
  children: ReactNode
  titleButton?: ReactNode
  className?: string
  style?: React.CSSProperties
  onMounted?: () => void
}

/**
 * TitleContent Component
 * Wrapper component for chart sections with title
 * Matches Vue: views/mySpace/components/chartsInfo/TitleContent.vue
 */
export default function TitleContent({ 
  title, 
  children, 
  titleButton, 
  className = '', 
  style,
  onMounted
}: TitleContentProps) {
  useEffect(() => {
    if (onMounted) {
      onMounted()
    }
  }, [onMounted])

  return (
    <div className={`${styles.mainBox} ${className}`} style={{ width: '100%', display: 'flex', flexDirection: 'column', ...style }}>
      <div className={styles.titleBox}>
        <span>{title}</span>
        {titleButton && <div>{titleButton}</div>}
      </div>
      <div className={styles.contentBox}>
        {children}
      </div>
    </div>
  )
}
