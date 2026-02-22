'use client'

import { Modal, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  url: string
  visible: boolean
  onClose: () => void
  size?: number
}

/**
 * QRCode Component
 * Simple React component for displaying QR codes in a modal
 * Uses qrcode.react package (React version of qrcode)
 * 
 * Usage:
 * const [qrVisible, setQrVisible] = useState(false)
 * <QRCode url={url} visible={qrVisible} onClose={() => setQrVisible(false)} />
 */
export default function QRCode({ url, visible, onClose, size = 200 }: QRCodeProps) {
  const handleDownload = () => {
    // Get the SVG element
    const svg = document.getElementById(`qrcode-svg-${encodeURIComponent(url)}`)
    if (!svg) return

    // Convert SVG to canvas then to blob for download
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = size + 40 // Add margin
      canvas.height = size + 40
      ctx?.drawImage(img, 20, 20)
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = 'qrcode.png'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(downloadUrl)
        }
      })
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Modal
      title="QR Code"
      open={visible}
      onCancel={onClose}
      data-testid="modal-qrcode"
      footer={[
        <Button 
          key="download" 
          icon={<DownloadOutlined />} 
          onClick={handleDownload}
          data-testid="button-qrcode-download"
        >
          Download
        </Button>,
        <Button 
          key="close" 
          onClick={onClose}
          data-testid="button-qrcode-close"
        >
          Close
        </Button>,
      ]}
      width={400}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px' }}>
        <QRCodeSVG
          id={`qrcode-svg-${encodeURIComponent(url)}`}
          value={url}
          size={size}
          level="H"
          includeMargin={true}
        />
        <p style={{ margin: 0, color: 'rgba(0,0,0,0.6)', wordBreak: 'break-all', textAlign: 'center', fontSize: '12px' }}>
          {url}
        </p>
      </div>
    </Modal>
  )
}
