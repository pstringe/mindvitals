import { FC, MouseEventHandler, useEffect, useState } from 'react'
import { Grid, Snackbar } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useGetScreenersByProviderId, useRequestScreener, useSendResults } from 'api/screenerApi'
import {
  IScreenResult,
  IPatient
} from 'types'
import {ScreenResults} from 'components/screener/ScreenResults'
import {ScreenRequestResultDialog} from 'components/screener/ScreenRequestResultDialog';
import { handleClickSaveToClipboard as handleClip } from 'utils'
import useAuth from 'hooks/useAuth'
import { RouteBreadcrumbs } from 'components/common'

export const ResultList: FC = () => {
  const navigate = useNavigate()
  const sendResults = useSendResults();
  const getScreenersById = useGetScreenersByProviderId();
  const { user } = useAuth();
  const [patient, setPatient] = useState<IPatient>()
  const [patientResults, setPatientResults] = useState<IScreenResult[]>([])
  const [screenResult, setScreenResult] = useState<IScreenResult | null>(null)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleClickEdit: MouseEventHandler = event => {
    event.stopPropagation()
    navigate(`/patients/${patient?.id}/update-profile`)
  }

  const handleClickDownloadPDF = (result: IScreenResult) => {}

  const handleClickSaveToClipboard = handleClip;

  const handleClickShareResultsViaText = async (result: IScreenResult) => {
    const res = await sendResults(result, 'sms');
    const { destination } = res;
    setSnackbarMessage(`Shared results to ${destination}`);
    setSnackbarOpen(true);
  }

  const handleClickShareResultsViaEmail = async (result: IScreenResult) => {
    const res = await sendResults(result, 'email');
    const { destination } = res;
    setSnackbarMessage(`Shared results to ${destination}`);
    setSnackbarOpen(true);
  }

  const handleReviewScreenResult = (result: IScreenResult) => {
    setScreenResult(result)
    setIsResultDialogOpen(true)
  }

  const handleCloseResultDialog = () => {
    setIsResultDialogOpen(false)
  }

  const fetchScreeners = async (pageNo: number, pageSize: number, setRowCount: Function) => {
    const res = await getScreenersById(user?.providerId || '', pageNo, pageSize);
    setRowCount(res.count);
    const screeners = res.screeners;
    setPatientResults(cur => ([...screeners]))
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} >
        <RouteBreadcrumbs path="Results" />
      </Grid>
      <Grid 
        item 
        container 
        direction='column'
        justifyContent='flex-start' 
        xs={12} 
        mb={4} 
        sx={{
          
        }}>
        <ScreenResults
          paginationMode='server'
          fetchRows={fetchScreeners}
          displayByProvider={true}
          results={patientResults}
          onClickReview={handleReviewScreenResult}
          onClickSaveToClipboard={handleClickSaveToClipboard}
          onClickShareResultsViaText={handleClickShareResultsViaText}
          onClickShareResultsViaEmail={handleClickShareResultsViaEmail}
        />
      </Grid>
      {screenResult && (
        <ScreenRequestResultDialog
          isOpen={isResultDialogOpen}
          screenResult={screenResult}
          onClose={handleCloseResultDialog}
        />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage}/>
    </Grid>
  );
}