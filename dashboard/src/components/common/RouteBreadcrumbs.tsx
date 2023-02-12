import { FC } from 'react'
import { Box, Typography } from '@mui/material'

import { IPatient, IRoute } from 'types'
import {
  TGeneralRouteType,
  TPatientRouteType,
  GENERAL_ROUTES,
  PATIENT_ROUTES,
} from 'utils/constants'
import { Breadcrumbs } from 'components/common/Breadcrumbs'

interface RouteBreadcrumbProps {
  path: TGeneralRouteType | TPatientRouteType
  patient?: IPatient
}

export const RouteBreadcrumbs: FC<RouteBreadcrumbProps> = ({
  path,
  patient,
}) => {
  const patientBreadcrumbLinks = [
    GENERAL_ROUTES['Patients'],
    PATIENT_ROUTES['PatientDetail'](patient || {} as IPatient),
    PATIENT_ROUTES['PatientUpdate'](patient || {} as IPatient),
  ]

  let breadcrumbLinks: IRoute[] = []

  switch (path) {
    case 'Patients':
      breadcrumbLinks = [
        GENERAL_ROUTES['Dashboard'],
        GENERAL_ROUTES['Patients'],
      ]
      break
    case 'PatientDetail':
      breadcrumbLinks = patientBreadcrumbLinks.slice(0, 2)
      break
    case 'PatientUpdate':
      breadcrumbLinks = patientBreadcrumbLinks.slice(0, 3)
      break
    case 'AddPatient':
      breadcrumbLinks = [
        GENERAL_ROUTES['Patients'],
        GENERAL_ROUTES['AddPatient'],
      ]
      break
    case 'Results':
      breadcrumbLinks = [
        GENERAL_ROUTES['Dashboard'],
        GENERAL_ROUTES['Results']
      ]
      break
    default:
      breadcrumbLinks = []
      break
  }

  return (
    <Box display="flex" gap={1.5} flexDirection="column">
      <Typography variant="h3">
        {breadcrumbLinks[breadcrumbLinks.length - 1].label}
      </Typography>

      <Breadcrumbs links={breadcrumbLinks} />
    </Box>
  )
}
