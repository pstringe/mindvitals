import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Grid } from '@mui/material'
import { IPatient, IPatientForm } from 'types'
import { ProfileUpdateCard } from 'components/profile/ProfileUpdateCard'
import { RouteBreadcrumbs } from 'components/common'
import { useParams } from 'react-router-dom'
import { useGetPatientById, useUpdatePatient } from 'api/patientsApi'
import dayjs from 'dayjs'

export const ProfileUpdate: FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const updatePatient = useUpdatePatient()
  const getPatientById = useGetPatientById()
  const [patient, setPatient] = useState<IPatient>({} as IPatient)

  const handleGoBack = () => {
    navigate(-1)
  }

  const formatDate = (date: string) => {
    const formattedDate = date.split('T')[0] + 'T00:00:00'
    const final = dayjs(formattedDate).format('MM/DD/YYYY');
    return final;
  }

  const handleSave = async (patientform: IPatientForm) => {
    const dob = formatDate(patientform.dob);
    const payload = { 
      ...patientform, 
      phoneNo: patientform.phoneNo.replace(/\D/g, ''),
      dob: patientform.dob
    }
    try {
      await updatePatient(params.patientId || '', payload)
      navigate(-1)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      const p = await getPatientById(params.patientId)
      setPatient(p)
    })()
  }, [params])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RouteBreadcrumbs path="PatientUpdate" patient={patient} />
      </Grid>

      <Grid item xs={12}>
        {Object.keys(patient).length > 0 && (
          <ProfileUpdateCard
            patient={patient}
            onGoBack={handleGoBack}
            onSave={handleSave}
          />
        )}
      </Grid>
    </Grid>
  )
}
