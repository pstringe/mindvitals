import { FC, ReactNode } from 'react'
import { Chip } from '@mui/material'
import { ISeverityType } from 'types'

interface StatusChipProps {
  type: ISeverityType
  label: ReactNode
}

export const StatusChip: FC<StatusChipProps> = ({ type, label }) => {
  const getStyles = () => {
    switch (type) {
      case 'Minimal':
        return {
          color: 'primaryMint.main',
          backgroundColor: 'backgroundMint.main',
        }
      case 'Moderate':
        return {
          color: 'accentYellow.main',
          backgroundColor: 'yellow.main',
        }
      case 'Severe':
      default:
        return {
          color: 'accentRed.main',
          backgroundColor: 'backgroundRed.main',
        }
    }
  }

  const { color, backgroundColor } = getStyles()

  return (
    <>
      {type !== 'None' && (
        <Chip
          label={label}
          sx={{
            color,
            backgroundColor,
            borderRadius: 1,
            height: 24,
            fontSize: 14,
            lineHeight: 1,
            fontWeight: 400,
            paddingY: 0.5,
            paddingX: 1,

            '& > span': {
              padding: 0,
            },
          }}
        />
      )}
    </>
  )
}
