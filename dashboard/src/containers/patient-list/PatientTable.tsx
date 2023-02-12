import React, {FormEvent, useEffect, useState} from 'react'
import {
  GridColDef,
  GridFilterModel,
  GridLinkOperator,
  GridSelectionModel
} from '@mui/x-data-grid'
import { Box, Button, Card, Link, TextField } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import { Theme } from 'theme'
import FilterListIcon from '@mui/icons-material/FilterList'
import { StatusChip } from 'components/common'
import { useRequestScreener } from 'api/screenerApi'
import { toTitleCase } from 'utils/formatters'
import useAuth from 'hooks/useAuth'
import { BulkScreenerDialog } from './BulkScreenerDialog'
import { FilterDialog } from './FIlterDialog'
import { useSnackbar } from 'notistack'
import { ISeverityType } from 'types'
import { DataTable } from 'components/data-table/DataTable'


const useStyles = makeStyles(({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      border: 'none',

      '& .MuiDataGrid-cell': {
        borderBottom: 'none !important',
      },
    },
    row: {
      color: palette.primaryNavy.main,
      fontSize: 16,
      lineHeight: 1.2,
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

interface IPatientTableProps {
  patients: any[]
  paginationMode?: 'server' | 'client'
  fetchRows?: (page: number, pageSize: number, setRowCount: Function, filterModel?: GridFilterModel) => Promise<void>
  search?: (search: string, page: number, pageSize: number, setRowCount: Function, filterModel: GridFilterModel) => Promise<void>
}

const formatDateString = (date: string) => {
  const dateObj = new Date(date)
  const timeDiff = Math.abs(Date.now() - dateObj.getTime())
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  const diffWeeks = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7))
  const diffMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30))
  const diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365))

  let postfix = ''
  if (diffYears > 1) {
    postfix = `${diffYears} years ago`
  } else if (diffMonths > 1) {
    postfix = `${diffMonths} months ago`
  } else if (diffWeeks > 1) {
    postfix = `${diffWeeks} weeks ago`
  } else if (diffDays > 1) {
    postfix = `${diffDays} days ago`
  } else {
    postfix = 'today'
  }

  const dateArr = date.split('T')
  const dateString = dateArr[0]

  return dateString + (date ? ` (${postfix})` : '')
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    renderCell: rowData => {
      const formattedName = toTitleCase(rowData.value)
      return rowData.value ? (
        <Link sx={{ textDecoration: 'none' }} href={rowData.row.profile}>
          {formattedName}
        </Link>
      ) : null
    },
    flex: 3,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 2,
    renderCell: cellValues => {
      const { row } = cellValues
      const status = row.status === '' ? 'none' : row.status
      const formattedStatus = toTitleCase(status)
      return (
        <StatusChip
          type={formattedStatus as ISeverityType}
          label={formattedStatus}
        />
      )
    },
  },
  {
    field: 'screenerLastSent',
    headerName: 'Screener Last Sent',
    valueFormatter: params => {
      return formatDateString(params.value as string)
    },
    valueGetter: params => {
      let date = params.value
      if (date) {
        date = date.split('T')[0]
      }
      return date
    },
    type: 'date',
    flex: 2,
  },
  {
    field: 'profile',
    headerName: 'Profile',
    flex: 3,
    renderCell: rowData => {
      return rowData.value ? (
        <Link
          sx={{ textDecoration: 'none' }}
          color="secondaryGreen1.main"
          href={rowData.value}
        >
          View Profile
        </Link>
      ) : null
    },
  },
  // {
  //   field: 'menu',
  //   headerName: 'Menu',
  //   flex: 1,
  //   renderCell: cellValues => {
  //     // return (<PatientActions />)
  //     return null
  //   },
  // },
]

export const PatientTable: React.FC<IPatientTableProps> = ({ 
  patients,
  paginationMode = 'client',
  fetchRows,
  search,
 }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedPatients, setSelectedPatients] = React.useState<any[]>([])
  const [showBukScreenDialog, setShowBukScreenDialog] = React.useState(false)
  const [showFilterDialog, setShowFilterDialog] = React.useState(false)
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [],
    linkOperator: GridLinkOperator.Or,
  })
  const [loading, setLoading] = React.useState(false)
  const [existingValue, setExistingValue] = React.useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth()

  const requestScreenerViaEmail = useRequestScreener(
    'email',
    user?.providerId || '',
  )

  const requestScreenerViaSMS = useRequestScreener(
    'sms',
    user?.providerId || '',
  )

  const handleSelectionModelChange = (selectedRows: any[]) => {
    setSelectedPatients(selectedRows)
  }

  const handleSubmitBulkScreenRequest = (request: string, method: string) => {
    if (method === 'email') {
      selectedPatients.forEach(patient => {
        requestScreenerViaEmail(request, patient)
      })
    } else if (method === 'sms') {
      selectedPatients.forEach(patient => {
        requestScreenerViaSMS(request, patient)
      })
    }
    setShowBukScreenDialog(false)
    enqueueSnackbar('Screener has been sent to multiple patients.', {
      variant: 'success',
    })
  }

  const handleSubmitFilters = (status: string) => {
    setExistingValue(status)

    let statusFilter = {
      columnField: 'status',
      operatorValue: 'contains',
      value: status,
    }

    if (status === 'none') {
      setFilterModel({
        ...filterModel,
        items: [],
      })
    } else {
      setFilterModel({
        ...filterModel,
        items: [statusFilter],
      })
    }
    setShowFilterDialog(false)
  }

  const getPatients = async () => {
    if (!fetchRows)
      return;
    await fetchRows(0, 15, () => {}, filterModel);
    setLoading(false)
  }

  const onSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    if (!search || searchQuery == undefined)
      return;
    else if (searchQuery.length === 0){
        getPatients();
        return;
    }
    search(searchQuery, 0, 100, () => {}, filterModel)
    setLoading(false)
  }

  useEffect(() => {
    if (paginationMode === 'server' && fetchRows) {
      (async () => {
        setLoading(true)
        getPatients()
        setLoading(false);
      })()
    }
  }, [ filterModel]);
  
  return (
    <Box sx={{
      height: '100%',
    }}>
      <Card
        sx={{
          width: '100%',
          gap: '16px',
          padding: 4,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
          borderRadius: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '16px',
          }}
        >
          <Box>
            {search && <form onSubmit={(e) => onSubmitSearch(e)}> 
              <TextField
                value= {searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  width: '100%',
                  alignSelf: 'flex-start',
                }}
                label="Search"
              />
            </form>}

           
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          {selectedPatients.length > 0 && (
              <Button
                color="secondary"
                onClick={() => setShowBukScreenDialog(true)}
              >
                Bulk Screener
              </Button>
            )}
          <Button onClick={() => setShowFilterDialog(true)}>
            <FilterListIcon />
          </Button>
          </Box>
        </Box>
        <Box sx={{
        }}>
        {patients && <DataTable
          rows={patients}
          fetchRows={fetchRows}
          columns={columns}
          paginationMode='server'
          defaultPageSize={15}
          selectionModel={selectedPatients}
          onSelectionModelChange={handleSelectionModelChange}
          loading={loading}
         />}

        </Box>
      </Card>
      {showBukScreenDialog && (
        <BulkScreenerDialog
          isOpen={showBukScreenDialog}
          onClose={() => setShowBukScreenDialog(false)}
          onSubmit={handleSubmitBulkScreenRequest}
        />
      )}
      {showFilterDialog && (
        <FilterDialog
          existingValue={existingValue}
          isOpen={showFilterDialog}
          onClose={() => setShowFilterDialog(false)}
          onSubmit={handleSubmitFilters}
        />
      )}
    </Box>
  )
}
