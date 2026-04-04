import { QRCodeSVG } from 'qrcode.react'

export default function QRCodePage() {
  const menuUrl = window.location.origin + '/'

  return (
    <>
      <div className="content-header">
        <div>
          <h2>Kode QR</h2>
          <p>Bagikan menu ke pelanggan</p>
        </div>
      </div>
      <div className="content-body">
        <div className="qr-section">
          <h3>📱 Scan untuk Lihat Menu</h3>
          <p>Cetak kode QR ini dan tempel di toko supaya pelanggan bisa lihat menu lewat HP mereka.</p>
          <div className="qr-container">
            <QRCodeSVG
              value={menuUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#0f1117"
              level="M"
              includeMargin={false}
            />
          </div>
          <div className="qr-url">{menuUrl}</div>
          <div style={{ marginTop: '16px' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                const svg = document.querySelector('.qr-container svg')
                const svgData = new XMLSerializer().serializeToString(svg)
                const canvas = document.createElement('canvas')
                canvas.width = 600
                canvas.height = 600
                const ctx = canvas.getContext('2d')
                const img = new Image()
                img.onload = () => {
                  ctx.fillStyle = '#ffffff'
                  ctx.fillRect(0, 0, 600, 600)
                  ctx.drawImage(img, 100, 100, 400, 400)
                  ctx.font = 'bold 32px Inter, sans-serif'
                  ctx.textAlign = 'center'
                  ctx.fillStyle = '#0f1117'
                  ctx.fillText('Kedai Senyum', 300, 60)
                  ctx.font = '18px Inter, sans-serif'
                  ctx.fillStyle = '#64748b'
                  ctx.fillText('Scan untuk lihat menu', 300, 560)
                  const link = document.createElement('a')
                  link.download = 'senyum-menu-qr.png'
                  link.href = canvas.toDataURL('image/png')
                  link.click()
                }
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
              }}
            >
              Unduh Kode QR
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
