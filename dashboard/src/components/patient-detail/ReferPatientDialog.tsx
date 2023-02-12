import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

interface ReferPatientDialogProps {
  isOpen: boolean
  onClose: VoidFunction
  onRefer: (referNote: string) => void
}

export const ReferPatientDialog: FC<ReferPatientDialogProps> = ({
  isOpen,
  onClose,
  onRefer,
}) => {
  const [referNote, setReferNote] = useState('')

  useEffect(() => {
    setReferNote('')
  }, [isOpen])

  const handleChangeNote: ChangeEventHandler<HTMLInputElement> = event => {
    setReferNote(event.target.value)
  }

  const handleRefer = () => {
    onRefer(referNote)
  }

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
      <DialogTitle
        id="refer-patient-title"
        sx={{
          fontWeight: 500,
          fontSize: 24,
          lineHeight: 1,
          letterSpacing: 0.15,
        }}
      >
        Refer Patient
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 2 }}>
        <TextField
          label="Note"
          focused
          fullWidth
          multiline
          value={referNote}
          onChange={handleChangeNote}
          sx={{
            '& fieldset': {
              border: '1px solid #E3E3E3 !important',
            },
            '& legend': {
              color: '#456772 !important',
              fontSize: 10,
              visibility: 'visible',
            },
            '& textarea': {
              color: 'primaryNavy.main',
              fontFamily: 'Roboto',
              fontSize: 16,
              lineHeight: 1.5,
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ paddingRight: 2 }}>
        <Button
          onClick={handleRefer}
          sx={{ color: 'primaryMint.main' }}
          variant="text"
        >
          Refer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
