import { Button, Grid } from '@mui/material'
import { GridFilterModel } from '@mui/x-data-grid'
import { useGetPatients, useSearchPatientsByName } from 'api/patientsApi'
import { RouteBreadcrumbs } from 'components/common'
import CenterLoader from 'components/common/CenterLoader'
import useAuth from 'hooks/useAuth'
import { useEffect, useState, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { IPatient, IPatientRow } from 'types'

import { PatientTable } from './PatientTable'

export const PatientList: FC = () => {
  const [loading, setLoading] = useState(false)
  const [patients, setPatients] = useState([] as IPatientRow[])
  const navigate = useNavigate()
  const { user } = useAuth()
  const getPatients = useGetPatients()
  const searchPatientsByName = useSearchPatientsByName()

  const getRows = (patients: IPatient[]): IPatientRow[] => {
    const rows = patients.map(
      (patient: {
        id?: string
        firstName: string
        lastName: string
        phoneNo?: string
        email?: string
        dob?: Date
        dateOfMostRecentScreener?: string
        highestSeverityOfMostRecentScreener?: string
        providerId?: string
      }) => {
        return {
          ...patient,
          name: `${patient.firstName} ${patient.lastName}`,
          status: patient.highestSeverityOfMostRecentScreener ?? '',
          screenerLastSent: patient?.dateOfMostRecentScreener ?? '',
          profile: `/patients/${patient.id}`,
        }
      },
    )
    return rows
  }

  const fetchPatients = async (pageNo: number, pageSize: number, setRowCount: Function, filterModel?: GridFilterModel) => {
    const res = await getPatients(pageNo, pageSize, filterModel);
    setPatients(getRows(res.patients))
    setRowCount(res.count)
  }

  const search = async (search: string, pageNo: number, pageSize: number, setRowCount: Function, filterModel: GridFilterModel) => {
    const res = await searchPatientsByName(search, pageNo, pageSize, filterModel);
    setPatients(getRows(res.patients));
    setRowCount(res.count);
  }

  return (
    <Grid container spacing={4}>
      <Grid item sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
      }}
      >
        <RouteBreadcrumbs path="Patients" />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/create-patient')}
        >
          Add Patient
        </Button>
      </Grid>
      <Grid item xs={12} mb={4}>
        {loading ? <CenterLoader /> : 
        <PatientTable 
          patients={patients}
          fetchRows={fetchPatients}
          search={search}
          paginationMode="server"
        />}
      </Grid>
    </Grid>
  )
}
