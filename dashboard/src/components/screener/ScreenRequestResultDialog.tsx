import dayjs from 'dayjs'
import { FC } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import { IScreenResult } from 'types'
import { ScreenResultAnswerDetails } from './ScreenResultAnswerDetails'

interface ScreenRequestResultDialogProps {
  isOpen: boolean
  onClose: VoidFunction
  screenResult: IScreenResult
}

export const ScreenRequestResultDialog: FC<ScreenRequestResultDialogProps> = ({
  isOpen,
  screenResult,
  onClose,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="lg"
      sx={{
        '& .MuiPaper-root': {
          padding: '8px 8px 24px',
          width: 720,
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
        {dayjs(screenResult.createdAt).format('MMMM DD, YYYY')}
      </DialogTitle>
      <DialogContent sx={{ paddingBottom: 2 }}>
        {screenResult.answers.map(answer => (
          <ScreenResultAnswerDetails key={answer.type} answer={answer} />
        ))}
      </DialogContent>
      <DialogActions sx={{ paddingRight: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: 'primaryMint.main' }}
          variant="text"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
