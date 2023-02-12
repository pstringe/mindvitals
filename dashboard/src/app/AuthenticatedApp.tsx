import { Routes, Route, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'

import { PatientList } from 'containers/patient-list/PatientList'
import { PatientDetail } from 'containers/patient-detail/PatientDetail'
import { ProfileUpdate } from 'containers/profile/ProfileUpdate'
import { ResultList } from 'containers/result-list/ResultList'
import { CreatePatient } from 'components/profile/CreatePatient'
import { Sidebar } from './Sidebar'

export const AuthenticatedApp = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'backgroundGreen.main', p: 3 }}
      >
        <Routes>
          <Route path="/" element={<Navigate replace to="/patients" />} />
          <Route path='login' element={<Navigate to="/patients" />} />
          <Route path="patients">
            <Route index element={<PatientList />} />
            <Route path=":patientId">
              <Route path="update-profile" element={<ProfileUpdate />} />
              <Route index element={<PatientDetail />} />
            </Route>
          </Route>
          <Route path="create-patient" element={<CreatePatient />} />
          <Route path="results/:providerId">
            <Route index element={<ResultList />} />
          </Route>
        </Routes>
      </Box>
    </Box>
  )
}
