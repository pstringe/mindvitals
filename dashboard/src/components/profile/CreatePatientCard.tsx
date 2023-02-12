import dayjs from 'dayjs'
import { FC, useEffect } from 'react'
import { Button, Card, Divider, Grid, TextField } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

import { IPatient, IPatientForm } from 'types'

interface IPatientFormField {
  label: string
  key: keyof IPatientForm
  type?: 'date'
  required: boolean
}

const patientFields: IPatientFormField[] = [
  { label: 'First Name', key: 'firstName', required: true },
  { label: 'Last Name', key: 'lastName', required: true },
  { label: 'Date of Birth', key: 'dob', type: 'date', required: true },
  { label: 'Email', key: 'email', required: true },
  { label: 'Phone Number', key: 'phoneNo', required: true },
]

interface CreatePatientCardProps {
  patient: IPatient
  onGoBack: VoidFunction
  onSave: (result: IPatientForm) => void
}

export const CreatePatientCard: FC<CreatePatientCardProps> = ({
  patient,
  onGoBack,
  onSave,
}) => {
  const { control, handleSubmit } = useForm<IPatientForm>({
    defaultValues: {
      ...patient,
      dob: dayjs(patient.dob).format('YYYY-MM-DD'),
    },
  })

  //log control in useEffect
  useEffect(() => {
    console.log('control', control)
  }, [control])

  return (
    <Card
      sx={{
        padding: 4,
        paddingBottom: 2,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        borderRadius: 4,
      }}
    >
      <form onSubmit={handleSubmit(onSave)}>
        <Grid container spacing={4} mb={4}>
          {patientFields.map(patientField => (
            <Grid key={patientField.key} item xs={6}>
              <Controller
                name={patientField.key}
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    label={patientField.label}
                    type={patientField.type || 'text'}
                    color="secondary"
                    {...field}
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ marginLeft: -4, marginRight: -4 }} />

        <Grid container justifyContent="flex-end" pt={2}>
          <Button
            onClick={onGoBack}
            sx={{ color: 'secondaryGreen1.main' }}
            variant="text"
          >
            Go Back
          </Button>

          <Button
            type="submit"
            sx={{ color: 'secondaryGreen1.main' }}
            variant="text"
          >
            Save
          </Button>
        </Grid>
      </form>
    </Card>
  )
}
