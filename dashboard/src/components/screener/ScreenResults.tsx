import dayjs from 'dayjs'
import { FC, MouseEvent, useState } from 'react'
import { Box, Button, Card, IconButton, Link, Typography } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  GridValueFormatterParams,
} from '@mui/x-data-grid'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { toTitleCase, formatSource } from 'utils/formatters'
import { Theme } from 'theme'
import { getSeverityType } from 'utils'
import { IScreenResult, IScreenResultAnswer } from 'types'
import { StatusChip } from 'components/common/StatusChip'
import { ResponseMenu } from 'components/menus/ResponseMenu'
import { useParams,  } from 'react-router-dom'
import { useEffect } from 'react';
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

interface ScreenResultsProps {
  defaultPageSize?: number
  results: IScreenResult[]
  displayByProvider: boolean
  paginationMode?: 'server' | 'client'
  onClickReview: (result: IScreenResult) => void
  onClickSaveToClipboard: (result: IScreenResult) => void
  onClickShareResultsViaText: (result: IScreenResult) => void
  onClickShareResultsViaEmail: (result: IScreenResult) => void
  fetchRows?: (page: number, pageSize: number, setRowCount: Function) => Promise<void>
}

export const ScreenResults: FC<ScreenResultsProps> = ({
  defaultPageSize,
  results,
  displayByProvider = false,
  paginationMode = 'client',
  fetchRows,
  onClickReview,
  onClickSaveToClipboard,
  onClickShareResultsViaText,
  onClickShareResultsViaEmail,
}) => {
  const classes = useStyles()
  const params = useParams()

  const [currentResult, setCurrentResult] = useState<IScreenResult | null>(null)
  const [responseAnchorEl, setResponseAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const isResponseMenuOpen = Boolean(responseAnchorEl)
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize || 25);
  const [rowCount, setRowCount] = useState(results.length);
  const [loading, setLoading] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState<{
    mouseX: number,
    mouseY: number,
  } | null>(null)
  
  const handlePageSizeChange = (value: number, details: any) => {
    setPageSize(Math.max(1, value));
  }

  const handlePageNoChange = (value: number, details: any) => {
    setPageNo(Math.max(0, value));
  }

  const handleClickReview = (resultId?: string | number) => {
    const result = results.find(result => result.id === resultId)
    if (!result) return
    onClickReview(result)
  }

  const handleClickResponseButton = (
    event: MouseEvent<HTMLElement>,
    resultId?: string | number,
  ) => {
    event.preventDefault();
    if (!resultId) return
    const coords = {
      mouseX: event.clientX - 200,
      mouseY: event.clientY,
    }
    setContextMenuCoordinates(coords);
    setResponseAnchorEl(event.currentTarget)
    setCurrentResult(results.find(result => result.id === resultId) || null)
  }

  const handleCloseResponseMenu = () => {
    setResponseAnchorEl(null)
    setCurrentResult(null)
  }

  const nameField: GridColDef = {
    field: 'name',
    headerName: 'Name', 
    flex: 2,
    renderCell: cellValues => {
      const { row } = cellValues
      const formattedName = toTitleCase(row.name)
      return row.name ? (
        <Link style={{
          textDecoration: 'none',
        }} href={`/patients/${row.patientId}`}>
          {formattedName}
        </Link>
      ) : null
    },
  }

  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Timestamp',
      flex: 1,
      valueGetter: (param: GridValueGetterParams) => {
        return dayjs(param.row.createdAt).format('MM/DD/YYYY HH:mm')
      },
    },
    {
      field: 'answers',
      headerName: 'Results',
      flex: 3,
      renderCell: (param: GridRenderCellParams) => {
        const resultAnswers = param.value as IScreenResultAnswer[]
        const isHighRisk = resultAnswers.some(answer => answer.isHighRisk)

        return param.row.status === 'Completed' ? (
          <Box display="flex" gap={1}>
            {resultAnswers.map(resultAnswer => (
              <StatusChip
                key={resultAnswer.type}
                label={
                  <>
                    <b>{resultAnswer.type}</b> ({resultAnswer.score})
                  </>
                }
                type={getSeverityType(resultAnswer)}
              />
            ))}
            {isHighRisk && (
              <StatusChip label={<b>High Risk</b>} type="Severe" />
            )}
          </Box>
        ) : (
          param.row.status
        )
      },
    },
    {
      field: 'source',
      headerName: 'Source',
      flex: 1,
      renderCell: cellValues => {
        const { row } = cellValues
        const source = formatSource(row.source);
        return source
      },
    },
    {
      field: 'status',
      headerName: 'Responses',
      flex: 1,
      renderCell: (param: GridValueFormatterParams) =>
        param.value === 'Completed' ? (
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              onClick={() => handleClickReview(param.id)}
              sx={{
                color: 'secondaryGreen1.main',
                fontWeight: 'normal',
                padding: 0,
                textTransform: 'none',
              }}
            >
              Review
            </Button>

            <IconButton
              id={`response-button-${param.id}`}
              aria-controls={
                isResponseMenuOpen ? `response-menu-${param.id}` : undefined
              }
              aria-haspopup={true}
              aria-expanded={isResponseMenuOpen ? 'true' : undefined}
              onClick={event => handleClickResponseButton(event, param.id)}
              sx={{
                color: 'secondaryNavy1.main',
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        ) : (
          ''
        ),
    },
  ]
 
  return (
    <Card
      sx={{
        padding: 4,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
        borderRadius: 4,
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
        width="100%"
        height="100%"
      >
        {paginationMode ==='client' && <Typography variant="body1" mb={2}>RESULTS</Typography>}
        <DataTable
          rows={results}
          columns={!displayByProvider ? columns : [nameField, ...columns]}
          paginationMode={paginationMode}
          defaultPageSize={15}
          fetchRows={fetchRows}
        />
      </Box>

      {currentResult && responseAnchorEl && (
        <ResponseMenu
          anchorEl={responseAnchorEl}
          anchorPosition={
            contextMenuCoordinates ? {
              left: contextMenuCoordinates.mouseX,
              top: contextMenuCoordinates.mouseY
            } : undefined
          }
          ariaLabelledBy={`response-button-${currentResult.id}`}
          id={`response-menu-${currentResult.id}`}
          isMenuOpen={Boolean(responseAnchorEl)}
          onClickSaveToClipboard={() => onClickSaveToClipboard(currentResult)}
          onClickShareResultsViaText={() =>
            onClickShareResultsViaText(currentResult)
          }
          onClickShareResultsViaEmail={() =>
            onClickShareResultsViaEmail(currentResult)
          }
          onClose={handleCloseResponseMenu}
        />
      )}
    </Card>
  )
}
