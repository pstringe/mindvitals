import { FC, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Grid,
  Snackbar,
  Alert
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { IPatient, IPatientForm } from 'types'
import { RouteBreadcrumbs } from 'components/common'
import { CreatePatientCard } from 'components/profile/CreatePatientCard'
import { useCreatePatient } from 'api/patientsApi'
import useAuth from 'hooks/useAuth'

export const CreatePatient: FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [patient, setPatient] = useState<IPatient>({} as IPatient);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState<'success' | 'error'| 'warning'| 'info'>('success');
  const { user } = useAuth();
  const createPatient = useCreatePatient();

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSave = async (patientform: IPatientForm) => {
    const patient = await createPatient({ 
      ...patientform, 
      providerId: user?.providerId,
      phoneNo: patientform.phoneNo.replace(/\D/g, ''),
      dob: new Date(patientform.dob)
    });
    console.log(patient)
    if (patient?.status === 404) {
      enqueueSnackbar(patient.message, { variant: 'error' });
    } else {
      enqueueSnackbar('Patient has been succesfully added.', { variant: 'success' });
    }
  }

  const handelSnackbarClose = () => {
    setShowSnackbar(false);
    navigate(-1)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <RouteBreadcrumbs path="AddPatient" patient={patient} />
      </Grid>

      <Grid item xs={12}>
        <CreatePatientCard
          patient={patient}
          onGoBack={handleGoBack}
          onSave={handleSave}
        />
      </Grid>
      <Snackbar  open={showSnackbar} autoHideDuration={6000} onClose={() => setShowSnackbar(false)}>
        <Alert onClose={handelSnackbarClose} severity={snackbarStatus} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  )
}
