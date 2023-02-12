import { FC, useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import config from '../../utils/config'
import QRCode from 'react-qr-code'

interface QrCodeDialogProps {
  screenerId: string
  isOpen: boolean
  onClose: VoidFunction
}

export const QrCodeDialog: FC<QrCodeDialogProps> = ({
  screenerId,
  isOpen,
  onClose,
}) => {
  const [linkToScreener, setLinkToScreener] = useState<string>('')

  useEffect(() => {
    const link = `${config.patientBaseUrl}/${screenerId}`
    setLinkToScreener(link)
  }, [isOpen, screenerId])

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          padding: '16px 8px 24px',
          width: 640,
        },
      }}
      aria-labelledby="refer-patient-title"
    >
      <DialogContent
        sx={{
          paddingBottom: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <QRCode value={linkToScreener} />
        <p style={{
          textAlign: 'center',
        }}>{linkToScreener}</p>
      </DialogContent>
    </Dialog>
  )
}
