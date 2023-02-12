import clsx from 'clsx'
import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { Box, Card, Typography } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  DataGrid,
  GridRow,
  GridColDef,
  GridValueGetterParams,
} from '@mui/x-data-grid'

import { IPatient, IPatientReferral } from 'types'
import { Theme } from 'theme'

const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      border: 'none',

      '& .MuiDataGrid-cell': {
        borderBottom: 'none !important',
      },
    },
    row: {
      borderRadius: spacing(1),
      color: palette.primaryNavy.main,
      fontSize: 16,
      lineHeight: 1.2,
      marginTop: 2,
    },
    highlightedRow: {
      backgroundColor: '#FFF6D6',
      '&:hover': {
        backgroundColor: '#FFF6D6 !important',
      },
    },
    columnHeaders: {
      background: palette.backgroundGray.main,
      borderRadius: spacing(1),
      borderBottom: 'none',

      color: palette.secondaryNavy1.main,
      fontSize: 16,
      lineHeight: 1.2,
    },
    columnSeparator: {
      display: 'none !important',
    },
    footerContainer: {
      borderTop: `1px solid ${palette.distinctiveGray.main}`,
      margin: spacing(0, -4),
      padding: spacing(0, 4),
    },
  }),
)

export const PatientReferralRow = (props: any) => {
  const classes = useStyles()
  const createdAt = dayjs(props.row.createdAt)
  const diffInDays = dayjs(new Date()).diff(createdAt, 'day')
  return (
    <GridRow
      {...props}
      className={clsx(diffInDays < 7 && classes.highlightedRow)}
    />
  )
}

interface PatientReferralsProps {
  patient: IPatient
  referrals: IPatientReferral[]
}

export const PatientReferrals: FC<PatientReferralsProps> = ({
  patient,
  referrals,
}) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(5)

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Timestamp',
      width: 150,
      valueGetter: (param: GridValueGetterParams) => {
        return dayjs(param.row.createdAt).format('MM/DD/YYYY HH:mm')
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
    },
  ]

  return (
    <Card
      sx={{
        padding: 4,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        borderRadius: 4,
      }}
    >
      <Typography variant="body1" mb={2}>
        REFERRAL
      </Typography>

      <Box
        height={130 + 54 * Math.min(referrals.length, pageSize)}
        width="100%"
      >
        <DataGrid
          components={{
            Row: PatientReferralRow,
          }}
          density="compact"
          disableColumnMenu
          disableColumnFilter
          headerHeight={85}
          rows={referrals}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          rowsPerPageOptions={[5, 10, 25, 50]}
          rowHeight={75}
          columns={columns}
          disableSelectionOnClick
          classes={{
            root: classes.root,
            row: classes.row,
            footerContainer: classes.footerContainer,
            columnHeaders: classes.columnHeaders,
            columnSeparator: classes.columnSeparator,
          }}
        />
      </Box>
    </Card>
  )
}
