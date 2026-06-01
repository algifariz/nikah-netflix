'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  onClose: () => void
}

interface ScanResult {
  guest: {
    name: string
    category: string
    rsvp_status: string
  }
  already_scanned: boolean
  warning?: string
}

export function QRScannerModal({ onClose }: Props) {
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef<any>(null)

  // Stop camera and cleanup
  const stopCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) { // SCANNING state
          await scannerRef.current.stop()
        }
      } catch {
        // ignore errors during cleanup
      }
      try {
        scannerRef.current.clear()
      } catch {
        // ignore
      }
      scannerRef.current = null
    }
    setScanning(false)
  }, [])

  // Handle close - stop camera first then close modal
  const handleClose = useCallback(async () => {
    await stopCamera()
    onClose()
  }, [stopCamera, onClose])

  useEffect(() => {
    let mounted = true

    async function initScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        if (!mounted) return

        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner
        setScanning(true)

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 200, height: 200 },
            aspectRatio: 1,
          },
          async (decodedText: string) => {
            // Stop scanning immediately after reading
            try {
              await scanner.stop()
            } catch {}
            setScanning(false)
            if (mounted) {
              await handleScan(decodedText)
            }
          },
          () => {} // ignore scan failures
        )
      } catch (err) {
        console.error('Scanner init error:', err)
        if (mounted) setScanning(false)
      }
    }

    initScanner()

    // Cleanup on unmount - ALWAYS stop camera
    return () => {
      mounted = false
      stopCamera()
    }
  }, [stopCamera])

  async function handleScan(data: string) {
    try {
      let code = data
      try {
        const parsed = JSON.parse(data)
        code = parsed.code
      } catch {
        // Use raw string as code
      }

      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        setError('Tamu tidak ditemukan')
        return
      }

      const scanResult = await res.json()
      setResult(scanResult)
    } catch {
      setError('Gagal memproses QR code')
    }
  }

  async function handleManualScan() {
    if (!manualCode.trim()) return
    await stopCamera()
    await handleScan(manualCode.trim())
  }

  async function handleScanAgain() {
    setResult(null)
    setError('')
    setManualCode('')

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner
      setScanning(true)

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1,
        },
        async (decodedText: string) => {
          try {
            await scanner.stop()
          } catch {}
          setScanning(false)
          await handleScan(decodedText)
        },
        () => {}
      )
    } catch (err) {
      console.error('Scanner restart error:', err)
      setScanning(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
      <div className="bg-netflix-dark rounded-xl w-full max-w-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">QR Scanner</h3>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-netflix-gray/30 flex items-center justify-center text-netflix-light/50 hover:text-white hover:bg-netflix-gray/50 transition"
          >
            ✕
          </button>
        </div>

        {!result && !error && (
          <>
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-lg overflow-hidden bg-black mb-4">
              <div id="qr-reader" className="w-full h-full [&_video]:!object-cover [&_video]:!w-full [&_video]:!h-full [&_img]:hidden [&>div]:!border-none" />
              {/* Scan frame overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-[15%] border-2 border-netflix-red/50 rounded-lg" />
                <div className="absolute top-[15%] left-[15%] w-6 h-6 border-t-[3px] border-l-[3px] border-netflix-red rounded-tl-lg" />
                <div className="absolute top-[15%] right-[15%] w-6 h-6 border-t-[3px] border-r-[3px] border-netflix-red rounded-tr-lg" />
                <div className="absolute bottom-[15%] left-[15%] w-6 h-6 border-b-[3px] border-l-[3px] border-netflix-red rounded-bl-lg" />
                <div className="absolute bottom-[15%] right-[15%] w-6 h-6 border-b-[3px] border-r-[3px] border-netflix-red rounded-br-lg" />
              </div>
            </div>

            <p className="text-center text-netflix-light/40 text-xs mb-4">
              Arahkan kamera ke QR Code tamu
            </p>

            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Atau masukkan kode manual"
                className="flex-1 bg-netflix-black border border-netflix-gray/30 rounded-lg p-2.5 text-sm text-white focus:border-netflix-red focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
              />
              <button onClick={handleManualScan} className="netflix-btn text-sm px-4">
                Cek
              </button>
            </div>
          </>
        )}

        {result && (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">
              {result.already_scanned ? '⚠️' : '✅'}
            </div>
            <h4 className="text-xl font-bold mb-2">{result.guest.name}</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                result.guest.category === 'VVIP' ? 'bg-yellow-600 text-white' :
                result.guest.category === 'VIP' ? 'bg-purple-600 text-white' :
                'bg-netflix-gray text-white'
              }`}>
                {result.guest.category}
              </span>
              <span className={`text-xs ${
                result.guest.rsvp_status === 'attending' ? 'text-green-400' :
                result.guest.rsvp_status === 'not_attending' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {result.guest.rsvp_status === 'attending' ? 'Hadir' :
                 result.guest.rsvp_status === 'not_attending' ? 'Tidak Hadir' : 'Pending'}
              </span>
            </div>
            {result.already_scanned && (
              <p className="text-yellow-400 text-sm mt-2 bg-yellow-400/10 rounded-lg p-2">
                ⚠️ Tamu ini sudah pernah scan sebelumnya
              </p>
            )}
            {result.warning && (
              <p className="text-yellow-400 text-sm mt-2">{result.warning}</p>
            )}
            <div className="flex gap-2 mt-6">
              <button onClick={handleScanAgain} className="netflix-btn flex-1">
                Scan Lagi
              </button>
              <button onClick={handleClose} className="flex-1 px-4 py-3 rounded bg-netflix-gray/30 text-white text-sm font-bold hover:bg-netflix-gray/50 transition">
                Tutup
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">❌</div>
            <p className="text-red-400 mb-4 text-sm">{error}</p>
            <div className="flex gap-2">
              <button onClick={handleScanAgain} className="netflix-btn flex-1">
                Coba Lagi
              </button>
              <button onClick={handleClose} className="flex-1 px-4 py-3 rounded bg-netflix-gray/30 text-white text-sm font-bold hover:bg-netflix-gray/50 transition">
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
