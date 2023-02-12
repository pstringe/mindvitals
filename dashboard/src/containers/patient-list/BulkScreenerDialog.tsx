import { FC, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useGetScreenerOptions } from 'api/screenerApi'

interface BulkScreenerDialogProps {
  isOpen: boolean
  onClose: VoidFunction
  onSubmit: (method: string, request: string) => void
}

interface IOption {
  value: string
  label: string
  payload: any
}

export const BulkScreenerDialog: FC<BulkScreenerDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [options, setOptions] = useState<IOption[]>([]);
  const [questionnaire, setQuestionnaire] = useState<string[]>([]);
  const getScreenerOptions = useGetScreenerOptions();

  const [method, setMethod] = useState('email')

  useEffect(() => {
    (async() => {
      const options = await getScreenerOptions();
      setOptions(options);
      setQuestionnaire(['gad7', 'phq9']);
    })();
  }, [isOpen])

  const handleChange = (event: SelectChangeEvent<typeof questionnaire>) => {
    const {
      target: { value },
    } = event
    setQuestionnaire(typeof value === 'string' ? value.split(',') : value)
  }

  const handleChangeMethod = (event: SelectChangeEvent) => {
    setMethod(event.target.value)
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
        Select Questionnaire
      </DialogTitle>
      <DialogContent
        sx={{
          paddingBottom: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <Select
          label="Screener"
          fullWidth
          multiline
          multiple={true}
          value={questionnaire as string[]}
          renderValue={selected => selected.join(', ')}
          onChange={handleChange}
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
          {options?.length && options.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Method"
          fullWidth
          multiline
          value={method}
          onChange={handleChangeMethod}
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
          <MenuItem key={'email'} value={'email'}>
            Email
          </MenuItem>
          <MenuItem key={'sms'} value={'sms'}>
            SMS
          </MenuItem>
        </Select>
      </DialogContent>
      <DialogActions sx={{ paddingRight: 2 }}>
        <Button
          onClick={() => onSubmit(questionnaire.join(','), method)}
          sx={{ color: 'primaryMint.main' }}
          variant="text"
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}
