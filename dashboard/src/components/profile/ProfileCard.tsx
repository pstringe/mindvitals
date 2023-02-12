import { FC, MouseEventHandler } from 'react'
import { Box, Button, Card, Grid, Typography } from '@mui/material'

import { IPatient } from 'types'
import { formatFullName } from 'utils'
import dayjs from 'dayjs'

interface ProfileCardProps {
  patient: IPatient
  onEdit: MouseEventHandler
}

const formatDate = (date: string) => {
  const formattedDate = date.split('T')[0] + '00:00:00'
  const final = dayjs(formattedDate).format('MM/DD/YYYY');
  return final;
}

export const ProfileCard: FC<ProfileCardProps> = ({ patient, onEdit }) => {
  const profileItems = [
    { label: 'Name', value: formatFullName(patient) },
    { label: 'Email', value: patient.email },
    { label: 'Phone', value: patient.phoneNo },
    { label: 'DOB', value: formatDate(patient?.dob?.toString() || '')},
  ]

  return (
    <Card
      sx={{
        padding: 4,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        borderRadius: 4,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography variant="body1">PROFILE</Typography>
            <Button
              onClick={onEdit}
              sx={{
                color: 'secondaryGreen1.main',
                padding: 0,
                textTransform: 'none',
              }}
            >
              Edit
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={6} mb={4}>
            {profileItems.map(profileItem => (
              <Box key={profileItem.label}>
                <Typography color="secondaryNavy2.main" variant="body1">
                  {profileItem.label}
                </Typography>
                <Typography variant="subtitle1">{profileItem.value}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}
