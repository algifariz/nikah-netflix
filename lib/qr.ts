import QRCode from 'qrcode'

export async function generateQRCode(data: string): Promise<string> {
  return QRCode.toDataURL(data, {
    width: 300,
    margin: 2,
    color: {
      dark: '#E50914',
      light: '#141414',
    },
  })
}
