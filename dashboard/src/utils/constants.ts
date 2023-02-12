import { IPatient, IRoute } from 'types'
import { formatFullName } from 'utils'

export type TGeneralRouteType = 'Patients' | 'Results' | 'AddPatient' | 'Dashboard' 

export type TPatientRouteType = 'PatientDetail' | 'PatientUpdate' 

export const GENERAL_ROUTES: Record<TGeneralRouteType, IRoute> = {
  Dashboard: {
    label: 'Dashboard',
    link: '/dashboard',
  },
  Patients: {
    label: 'Patients',
    link: '/patients',
  },
  Results: {
    label: 'Results',
    link: '/results',
  },
  AddPatient: {
    label: 'Add Patient',
    link: `/create-patient`,
  },
}

export const PATIENT_ROUTES: Record<
  TPatientRouteType,
  (patient: IPatient) => IRoute
> = {
  PatientDetail: (patient: IPatient) => ({
    label: formatFullName(patient),
    link: `/patients/${patient.id}`,
  }),

  PatientUpdate: (patient: IPatient) => ({
    label: 'Update Patient',
    link: `/patients/${patient.id}/update-profile`,
  }),
}
