import { ChangeEvent, FC, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

interface FilterDialogProps {
  existingValue: string
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (status: string) => void
}

export const FilterDialog: FC<FilterDialogProps> = ({
  existingValue,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [status, setStatus] = useState<string>(existingValue ?? '')

  useEffect(() => {}, [isOpen])

  const handleStatusChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      target: { value },
    } = event
    setStatus(value)
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
        Filter
      </DialogTitle>
      <DialogContent
        sx={{
          paddingBottom: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <TextField
          select={true}
          label="Status"
          fullWidth
          multiline
          value={status}
          onChange={handleStatusChange}
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
        >
          <MenuItem key={'none'} value={'none'}>
            None
          </MenuItem>
          <MenuItem key={'normal'} value={'normal'}>
            Normal
          </MenuItem>
          <MenuItem key={'moderate'} value={'moderate'}>
            Moderate
          </MenuItem>
          <MenuItem key={'severe'} value={'severe'}>
            Severe
          </MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ paddingRight: 2 }}>
        <Button
          onClick={() => {
            setStatus('none')
          }}
          sx={{ color: 'primaryMint.main' }}
          variant="text"
        >
          Clear
        </Button>
        <Button
          onClick={() => onSubmit(status)}
          sx={{ color: 'primaryMint.main' }}
          variant="text"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
